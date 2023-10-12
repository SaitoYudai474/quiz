document.addEventListener("DOMContentLoaded", () => {
    // クイズ開始
    document.getElementById('quiz-initiate').addEventListener('click', () => {
        clear();
        sessionStorage.setItem('key', '1');
        createQuestions(1);
    });

    // 次の問題に移る
    function showNext() {
        const choices = document.getElementsByName('choice');
        const key = sessionStorage.getItem('key');
        const nextKey = parseInt(key) + 1;
        sessionStorage.setItem('key', nextKey);
        let answer;
        choices.forEach((choice) => {
            if (choice.checked) {
                answer = choice.value;
            }
        });
        let answers = sessionStorage.getItem('answers');
        let prevAnswer = '';
        if (answers) {
            answers = JSON.parse(answers);
            answers[key] = answer;
            if (answers.hasOwnProperty(nextKey)) {
                prevAnswer = answers[nextKey];
            }
            answers = JSON.stringify(answers);
        } else {
            answers = {
                [key]: answer
            };
            answers = JSON.stringify(answers);
        }
        sessionStorage.setItem('answers', answers);
        clear();
        createQuestions(nextKey, prevAnswer);
    }

    // 前の問題に移る
    function showPrev() {
        const key = sessionStorage.getItem('key');
        const prevKey = parseInt(key) - 1;
        sessionStorage.setItem('key', prevKey)
        let answers = sessionStorage.getItem('answers');
        answers = JSON.parse(answers);
        const prevAnswer = answers[prevKey];
        clear();
        createQuestions(prevKey, prevAnswer);
    }

    // 回答を完了する
    function complete() {
        const choices = document.getElementsByName('choice');
        const lastKey = sessionStorage.getItem('key');
        let lastAnswer;
        choices.forEach((choice) => {
            if (choice.checked) {
                lastAnswer = choice.value;
            }
        });
        let answers = sessionStorage.getItem('answers');
        answers = JSON.parse(answers);
        answers[lastKey] = lastAnswer;
        let entries = Object.entries(answers);
        answers = JSON.stringify(answers);
        sessionStorage.setItem('answers', answers);
        

        const fragment = document.createDocumentFragment();

        const table = document.createElement('table');
        table.className = 'table';
        const thead = document.createElement('thead');
        let tr = document.createElement('tr');
        const header = ['No.', '問題', '答え', 'あなたの回答'];
        for (let i = 0; i < header.length; i++) {
            const th = document.createElement('th');
            th.scope = 'col';
            th.textContent = header[i];
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        let score = 0;
        for (const [key, answer] of entries) {
            const question = questions[key];
            if (question.answer === answer) {
                score += 1;
            }
            const tr = document.createElement('tr');
            const td = `<td>${key}</td>
            <td>${question.question}</td>
            <td>${question.answer}</td>
            <td>${answer}</td>`;
            tr.insertAdjacentHTML('beforeend', td);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        fragment.appendChild(table);
        const result = document.createElement('p');
        result.className = 'lead';
        result.textContent = `あなたの得点は${score}点です`;
        fragment.prepend(result);
        const button = document.createElement('div');
        button.className = 'row justify-content-center mt-3';
        button.appendChild(createBtn('top'));
        fragment.appendChild(button);
        clear();
        document.getElementById('root').appendChild(fragment);
    }

    // 回答をやめトップに戻る
    function exit() {
        sessionStorage.clear();
        location.reload();
    }

    // 問題のDOM作成
    function createQuestions(key, prevAnswer) {
        const fragment = document.createDocumentFragment();
        const question = document.createElement('p');
        question.className = 'lead';
        question.textContent = `問${key}.　${questions[key].question}`;
        fragment.appendChild(question);
        questions[key].choices.forEach((choice, index) => {
            const row = document.createElement('div');
            row.className = 'row justify-content-center';
            const div = document.createElement('div');
            div.className = 'form-check col-6';
            const input = document.createElement('input');
            input.className = 'form-check-input';
            input.type = 'radio';
            input.name = 'choice';
            input.value = choice;
            const id = `choice${index}`;
            input.id = id;
            if (prevAnswer === choice || index === 0) {
                input.checked = true;
            }
            div.appendChild(input);
            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.htmlFor = id;
            label.textContent = choice;
            div.appendChild(label);
            row.appendChild(div);
            fragment.appendChild(row);
        });
        const buttons = document.createElement('div');
        buttons.className = 'row justify-content-center mt-3';
        if (key === 1) {
            buttons.appendChild(createBtn('exit'));
            buttons.appendChild(createBtn('next'));
        } else if (key === 5) {
            buttons.appendChild(createBtn('prev'));
            buttons.appendChild(createBtn('complete'));
        } else {
            buttons.appendChild(createBtn('prev'));
            buttons.appendChild(createBtn('next'));
        }
        fragment.appendChild(buttons);

        document.getElementById('root').appendChild(fragment);
    }

    // 要素のクリア
    function clear() {
        const root = document.getElementById('root');
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }
    }

    // ボタン作成
    function createBtn(type) {
        const col = document.createElement('div');
        col.className = 'col-3';
        const btn = document.createElement('button');
        switch (type) {
            case 'next':
                btn.className = 'btn btn-primary';
                btn.id = 'next-btn';
                btn.textContent = '次の問題へ進む';
                btn.addEventListener('click', showNext);
                break;
            case 'prev':
                btn.className = 'btn btn-secondary';
                btn.id = 'prev-btn';
                btn.textContent = '前の問題へ戻る';
                btn.addEventListener('click', showPrev);
                break;
            case 'exit':
                btn.className = 'btn btn-secondary';
                btn.id = 'exit-btn';
                btn.textContent = '回答を中止する';
                btn.addEventListener('click', exit);
                break;
            case 'complete':
                btn.className = 'btn btn-primary';
                btn.id = 'complete-btn';
                btn.textContent = '回答を完了する';
                btn.addEventListener('click', complete);
                break;
            case 'top':
                btn.className = 'btn btn-secondary';
                btn.id = 'top-btn';
                btn.textContent = 'トップに戻る';
                btn.addEventListener('click', exit);
                break;
        }
        col.appendChild(btn);
        return col;
    }
});

// 問題一覧
const questions = {
    "1": {
        "question": "林檎はなんて読む？",
        "choices": [
            "ぶどう",
            "みかん",
            "りんご",
            "もも"
        ],
        "answer": "りんご"
    },
    "2": {
        "question": "7 + 12 × 6 の答えは？",
        "choices": [
            "79",
            "114",
            "66",
            "201"
        ],
        "answer": "79"
    },
    "3": {
        "question": "メメントモリとはどういう意味？",
        "choices": [
            "友人を大切にしよう",
            "自分がいつか必ず死ぬことを忘れるな",
            "後悔は無意味だ",
            "努力しても報われるとは限らない"
        ],
        "answer": "自分がいつか必ず死ぬことを忘れるな"
    },
    "4": {
        "question": "英語で\"ephemeral\"とはどういう意味？",
        "choices": [
            "真っ白な",
            "静止した",
            "尊い",
            "一瞬の"
        ],
        "answer": "一瞬の"
    },
    "5": {
        "question": "17を2進数で表すといくつ？",
        "choices": [
            "10100",
            "10001",
            "1111",
            "11010"
        ],
        "answer": "10001"
    }
};