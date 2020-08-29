const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

document.body.style.padding = "0"
document.body.style.margin = "0"

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.onresize = e =>
{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

document.body.appendChild(canvas)

const UserMouse = new Cursor(canvas.width / 2, canvas.height / 2, 25)
UserMouse.fillColor = "rgba(255, 0, 0, 0.3)"

let Objects = []


function Init()
{
    started = true

    for (let i = 0; i < 100; i++)
    {
        let r = 1.5 //1.5 default

        let x = r + Math.random() * (canvas.width - r)
        let y = r + Math.random() * (canvas.height - r)

        let circle = new Circle(x, y, r)
        circle.velocity.x = Math.random() * 2 - 1
        circle.velocity.y = Math.random() * 2 - 1

        Objects.push(circle)
    }

    Loop()
}

function Loop()
{
    Update()
    Draw()

    window.requestAnimationFrame(() => {
        Time.DeltaTime = new Date() - Time.LastFrame
        Time.LastFrame = new Date()

        Loop()
    })
}

function Update()
{
    Objects.forEach(obj => {
        obj.update()
    })

    UserMouse.update()
}

function Draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // ctx.fillStyle = "rgba(0, 255, 0, 0.3)"
    // ctx.font = "50px sans-serif"
    // ctx.fillText(`${Math.round(Time.FPS)}`, 50, 50)

    Objects.forEach(obj => {
        obj.draw()
    }) 

    UserMouse.draw()
}

let started = false
UserMouse.draw()