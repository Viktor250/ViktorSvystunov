const typeSelect = document.getElementById("typeSelect")
const addBtn = document.getElementById("addBtn")
const formArea = document.getElementById("formArea")


addBtn.onclick = () => {

    const type = typeSelect.value

    const row = document.createElement("div")
    row.className = "row"

    const label = document.createElement("div")
    label.textContent = type + ":"

    const input = document.createElement("input")
    input.type = "text"
    input.dataset.type = type

    const msg = document.createElement("div")
    msg.className = "msg"

    row.append(label, input, msg)


    if (type === "password") {

        const list = document.createElement("ul")

        list.innerHTML = `
        <li>Мінімум 6 символів</li>
        <li>Велика літера</li>
        <li>Мала літера</li>
        <li>Цифра</li>
        <li>Спецсимвол</li>
        <li>Без пробілів</li>
        <li>Тільки латиниця</li>
        `

        row.appendChild(list)

    }


    if (type === "phone") {

    input.value = "+38(0"

    setTimeout(() => {
        input.setSelectionRange(
            input.value.length,
            input.value.length
        )
    })

    }


    input.addEventListener("input", formatInput)
    input.addEventListener("input", validate)

    formArea.appendChild(row)

}



function formatInput(e) {

    const input = e.target
    const type = input.dataset.type

    let v = input.value


    // PHONE

    if (type === "phone") {

        let digits = v.replace(/\D/g, "")

        if (digits.startsWith("38"))
            digits = digits.slice(2)

        if (digits.startsWith("0"))
            digits = digits.slice(1)

        digits = digits.slice(0,9)

        let res = "+38(0"

        if (digits.length >= 1)
            res += digits.slice(0,2)

        if (digits.length >= 2)
            res = "+38(0" + digits.slice(0,2) + ") "

        if (digits.length >= 3)
            res = "+38(0" + digits.slice(0,2) + ") " +
                  digits.slice(2,5)

        if (digits.length >= 5)
            res = "+38(0" + digits.slice(0,2) + ") " +
                  digits.slice(2,5) + "-" +
                  digits.slice(5,7)

        if (digits.length >= 7)
            res = "+38(0" + digits.slice(0,2) + ") " +
                  digits.slice(2,5) + "-" +
                  digits.slice(5,7) + "-" +
                  digits.slice(7,9)

        input.value = res

    }


    // DATE

    if (type === "date") {

        v = v.replace(/\D/g, "")
        v = v.slice(0,8)

        if (v.length > 4)
            v =
                v.slice(0,2)+"/"+
                v.slice(2,4)+"/"+
                v.slice(4)

        else if (v.length > 2)
            v =
                v.slice(0,2)+"/"+
                v.slice(2)

        input.value = v

    }


    // TIME

    if (type === "time") {

        v = v.replace(/\D/g, "")
        v = v.slice(0,6)

        if (v.length > 4)
            v =
                v.slice(0,2)+":"+
                v.slice(2,4)+":"+
                v.slice(4)

        else if (v.length > 2)
            v =
                v.slice(0,2)+":"+
                v.slice(2)

        input.value = v

    }


    // INTEGER

    if (type === "number") {

        input.value =
            v.replace(/[^0-9-]/g, "")

    }


    // FLOAT

    if (type === "float") {

        input.value =
            v.replace(/[^0-9.,-]/g, "")

    }

}



function validate(e) {

    const input = e.target
    const type = input.dataset.type
    const value = input.value

    const msg = input.nextSibling

    let ok = true
    msg.textContent = ""


    // PASSWORD

    if (type === "password") {

        const li =
            input.parentNode.querySelectorAll("li")

        const rules = [

            value.length >= 6,
            /[A-Z]/.test(value),
            /[a-z]/.test(value),
            /\d/.test(value),
            /[!@#$%^&*]/.test(value),
            !/\s/.test(value),
            /^[A-Za-z0-9!@#$%^&*]*$/.test(value)

        ]

        rules.forEach((r,i)=>{

            li[i].style.color =
                r ? "green" : "red"

            if (!r) ok=false

        })

    }


    // DATE

    if (type === "date") {

        const r =
            /^(\d{2})\/(\d{2})\/(\d{4})$/

        const m=value.match(r)

        if (!m) {

            ok=false
            msg.textContent="dd/mm/yyyy"

        } else {

            const d=+m[1]
            const mo=+m[2]
            const y=+m[3]

            const dt =
                new Date(y,mo-1,d)

            if(
                dt.getFullYear()!=y||
                dt.getMonth()!=mo-1||
                dt.getDate()!=d
            ){

                ok=false
                msg.textContent="Нереальна дата"

            }

        }

    }


    // TIME

    if (type === "time") {

        const r =
            /^(\d{2}):(\d{2}):(\d{2})$/

        const m=value.match(r)

        if (!m) {

            ok=false
            msg.textContent="hh:mm:ss"

        } else {

            const h=+m[1]
            const mi=+m[2]
            const s=+m[3]

            if(
                h>23||
                mi>59||
                s>59
            ){

                ok=false
                msg.textContent="Нереальний час"

            }

        }

    }


    // INT

    if (type === "number") {

        if (!/^-?\d+$/.test(value)) {

            ok=false
            msg.textContent="Ціле число"

        }

    }


    // FLOAT

    if (type === "float") {

        if (!/^-?\d+([.,]\d+)?$/.test(value)) {

            ok=false
            msg.textContent="Десяткове число"

        }

    }


    // PHONE

    if (type === "phone") {

        if (!/^\+38\(0\d{2}\) \d{3}-\d{2}-\d{2}$/.test(value)) {

            ok=false
            msg.textContent="+38(0__) ___-__-__"

        }

    }


    // URL

    if (type === "url") {

        const r =
        /^(https?:\/\/)([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i

        if (!r.test(value)) {

            ok=false
            msg.textContent="Невірний URL"

        }

    }


    if (ok) {

        input.classList.remove("error")
        input.classList.add("ok")

    } else {

        input.classList.remove("ok")
        input.classList.add("error")

    }

}