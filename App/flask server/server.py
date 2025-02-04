from flask import Flask, request, jsonify
from transformers import T5Tokenizer, T5ForConditionalGeneration

app = Flask(__name__)

tokenizer = T5Tokenizer.from_pretrained("t5-small")
model = T5ForConditionalGeneration.from_pretrained("nomadic07/FineTuned-QuestionGeneration-T5")


def get_question(context, answer):
    sentence = extract_relevant_sentence(context, answer)

    prompt = 'Context: %s Answer: %s ' % (sentence, answer)
    inputs = tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True, padding="max_length").input_ids


    outputs = model.generate(inputs, max_length=50, num_beams=4)
    dec = tokenizer.decode(outputs[0], skip_special_tokens=True)

    print(dec)
    return dec


def extract_relevant_sentence(context, answer):
    sentences = context.split(". ")
    for sentence in sentences:
        if answer in sentence:
            return sentence
    return context


@app.route('/getques', methods=['POST'])
def getques():
    try:
        data = request.get_json()
        context = data.get('context', '')
        answer = data.get('answers', '')

        answers=answer.split(',')

        questions = []
        for answer in answers:
            question = get_question(context, answer)
            questions.append({'answer': answer, 'question': question})

        return jsonify({'questions': questions}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
