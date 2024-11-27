from flask import Flask, request, jsonify
from transformers import T5Tokenizer, T5ForConditionalGeneration

# Initialize Flask app
app = Flask(__name__)

# Load the T5 tokenizer and model
tokenizer = T5Tokenizer.from_pretrained("t5-small")
model = T5ForConditionalGeneration.from_pretrained("nomadic07/FineTuned-QuestionGeneration-T5")


def get_question(context, answer, mdl, tknizer):
    sentence = extract_relevant_sentence(context, answer)

    prompt = 'Context: %s Answer: %s ' % (sentence, answer)
    max_len = 256
    encoding = tknizer.encode_plus(prompt, max_length=max_len, pad_to_max_length=False, truncation=True, return_tensors="pt")

    input_ids, attention_mask = encoding["input_ids"], encoding["attention_mask"]

    outs = mdl.generate(
        input_ids=input_ids,
        attention_mask=attention_mask,
        early_stopping=True,
        num_beams=5,
        num_return_sequences=1,
        no_repeat_ngram_size=2,
        max_length=300
    )

    dec = [tknizer.decode(ids, skip_special_tokens=True) for ids in outs]

    Question = dec[0].replace("question:", "").strip()
    return Question


def extract_relevant_sentence(context, answer):
    sentences = context.split(". ")
    for sentence in sentences:
        if answer in sentence:
            return sentence
    return context


# Define route
@app.route('/getques', methods=['GET'])
def getques():
    try:
        # Get JSON data from request
        data = request.get_json()
        context = data.get('context', '')
        answers = data.get('answers', [])

        if not context or not answers:
            return jsonify({'error': 'Context and answers are required'}), 400

        if not isinstance(answers, list):
            return jsonify({'error': 'Answers should be a list'}), 400

        # Generate questions for each answer
        questions = []
        for answer in answers:
            question = get_question(context, answer, model, tokenizer)
            questions.append({'answer': answer, 'question': question})

        # Return questions as JSON
        return jsonify({'questions': questions}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
