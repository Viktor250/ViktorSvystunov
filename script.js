class Task {

    constructor(text, deadline, done = false) {

        this.text = text
        this.deadline = deadline
        this.done = done

    }

}



class TaskManager {

    constructor() {

        this.tasks =
            JSON.parse(
                localStorage.getItem("tasks")
            ) || []

    }

    save() {

        localStorage.setItem(
            "tasks",
            JSON.stringify(this.tasks)
        )

    }

    add(task) {

        this.tasks.push(task)

        this.save()

    }

    delete(index) {

        this.tasks.splice(index, 1)

        this.save()

    }

    toggle(index) {

        this.tasks[index].done =
            !this.tasks[index].done

        this.save()

    }

    edit(index, newText, newDate) {

        this.tasks[index].text = newText
        this.tasks[index].deadline = newDate

        this.save()

    }

    search(text) {

        return this.tasks.filter(t =>
            t.text
                .toLowerCase()
                .includes(text.toLowerCase())
        )

    }

    sortAll() {

        this.tasks.sort((a, b) => {

            if (a.done && !b.done) return 1
            if (!a.done && b.done) return -1

            if (!a.deadline) return 1
            if (!b.deadline) return -1

            return new Date(a.deadline) -
                   new Date(b.deadline)

        })

        this.save()

    }

}



const manager =
    new TaskManager()



const input =
    document.getElementById("taskInput")

const deadline =
    document.getElementById("deadlineInput")

const list =
    document.getElementById("taskList")

const searchInput =
    document.getElementById("searchInput")

const addBtn =
    document.getElementById("addBtn")

const sortBtn =
    document.getElementById("sortBtn")



function render(tasks = manager.tasks) {

    list.innerHTML = ""

    tasks.forEach((t, i) => {

        const li =
            document.createElement("li")

        const textSpan =
            document.createElement("span")

        let text = t.text

        if (t.deadline) {

            text += " | " + t.deadline

            const now = new Date()
            const d = new Date(t.deadline)

            const nowDate =
                new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate()
                )

            const taskDate =
                new Date(
                    d.getFullYear(),
                    d.getMonth(),
                    d.getDate()
                )

            const diffTime =
                taskDate - nowDate

            const diffDays =
                Math.round(
                    diffTime /
                    (1000 * 60 * 60 * 24)
                )

            if (diffDays > 1) {

                text +=
                    " | " +
                    diffDays +
                    " днів"

            }

            else if (diffDays === 1) {

                text += " | завтра"

            }

            else if (diffDays === 0) {

                text += " | сьогодні"

            }

            else if (diffDays === -1) {

                text += " | вчора"

                li.style.background =
                    "#ffcccc"

            }

            else if (diffDays < -1) {

                text +=
                    " | " +
                    Math.abs(diffDays) +
                    " днів тому"

                li.style.background =
                    "#ffcccc"

            }

        }

        textSpan.textContent = text

        if (t.done) {

            textSpan.classList.add("done")

        }



        const btnDiv =
            document.createElement("div")

        btnDiv.className = "buttons"



        const doneBtn =
            document.createElement("button")

        doneBtn.textContent = "✔"

        doneBtn.onclick = () => {

            manager.toggle(i)

            manager.sortAll()

            render()

        }



        const editBtn =
            document.createElement("button")

        editBtn.textContent = "Edit"

        editBtn.onclick = () => {

            const newText =
                prompt(
                    "Нове завдання",
                    t.text
                )

            const newDate =
                prompt(
                    "Нова дата",
                    t.deadline
                )

            if (newText !== null) {

                manager.edit(
                    i,
                    newText,
                    newDate
                )

                manager.sortAll()

                render()

            }

        }



        const delBtn =
            document.createElement("button")

        delBtn.textContent = "X"

        delBtn.onclick = () => {

            manager.delete(i)

            render()

        }



        btnDiv.appendChild(doneBtn)
        btnDiv.appendChild(editBtn)
        btnDiv.appendChild(delBtn)



        li.appendChild(textSpan)
        li.appendChild(btnDiv)

        list.appendChild(li)

    })

}



addBtn.onclick = () => {

    if (input.value === "")
        return

    const task =
        new Task(
            input.value,
            deadline.value
        )

    manager.add(task)

    manager.sortAll()

    input.value = ""
    deadline.value = ""

    render()

}



searchInput.oninput = () => {

    const result =
        manager.search(
            searchInput.value
        )

    render(result)

}



sortBtn.onclick = () => {

    manager.sortAll()

    render()

}



setInterval(() => {

    render()

}, 3000)



manager.sortAll()

render()