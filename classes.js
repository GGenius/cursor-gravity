class Time
{
    static Begin = new Date()
    static LastFrame = this.Begin
    static DeltaTime = 0

    static get FPS()
    {
        return 1000 / Time.DeltaTime
    }

    static get Now()
    {
        return new Date()
    }

    static get Current()
    {
        return Time.Now - Time.Begin
    }
}

class Vector2
{
    constructor(x, y)
    {
        this.x = x
        this.y = y
    }

    get length() 
    {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    get normalized()
    {
        let x = this.x / this.length
        let y = this.y / this.length

        return new Vector2(x, y)
    }

    static Distance(a, b)
    {
        let x = a.x - b.x
        let y = a.y - b.y

        return Math.sqrt(x ** 2 + y ** 2)
    }

    static Minus(a, b)
    {
        let x = a.x - b.x
        let y = a.y - b.y

        return new Vector2(x, y)
    }

    static Plus(a, b)
    {
        let x = a.x + b.x
        let y = a.y + b.y

        return new Vector2(x, y)
    }

    static Multiply(a, b)
    {
        let x = a.x * b
        let y = a.y * b

        return new Vector2(x, y)
    }

    static Divide(a, b)
    {
        let x = a.x / b
        let y = a.y / b

        return new Vector2(x, y)
    }
}

window.onmousemove = e =>
{
    Input.MouseX = e.clientX
    Input.MouseY = e.clientY

    if (!started)
    {
        let vec = new Vector2(Input.MouseX, Input.MouseY)
        if (Vector2.Distance(vec, UserMouse.position) < UserMouse.r)
        {
            Init()
        }
    }
}

window.onmousedown = e =>
{
    UserMouse.AntiGravity = !UserMouse.AntiGravity
    if (UserMouse.AntiGravity)
    {
        UserMouse.fillColor = "rgba(255, 0, 0, 0.3)"
    }
    else
    {
        UserMouse.fillColor = "rgba(0, 0, 255, 0.3)"
    }
}

window.onkeydown = e =>
{
    let key = e.keyCode
    if (key === 38)
    {
        UserMouse.r++
    }
    if (key === 40)
    {
        UserMouse.r--
        if (UserMouse.r < 0)
        UserMouse.r = 0
    }
}

class Input 
{
    static MouseX = 0
    static MouseY = 0
}

class Object
{
    constructor(x, y)
    {
        this.position = new Vector2(x, y)
        this.fillColor = "#000000"
        this.strokeColor = "#000000"
        this.velocity = new Vector2(0, 0)
    }

    update()
    {
        this.position = Vector2.Plus(this.position, this.velocity)
    }
}

class Circle extends Object
{
    constructor(x, y, r)
    {
        super(x, y)
        this.r = r

        this.inCursor = false

        this.collision = true
        this.eatable = false
        
        this.drawInCursorLine = false

        this.drawVelocity = false
        this.drawVelocityLen = 10
    }

    draw()
    {
        ctx.beginPath()

        ctx.fillStyle = this.fillColor
        ctx.strokeStyle = this.strokeColor

        ctx.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        ctx.closePath()

        if (this.drawVelocity)
        {
            ctx.beginPath()

            ctx.fillStyle = this.fillColor
            ctx.strokeStyle = this.strokeColor

            ctx.lineWidth = 0.5

            ctx.moveTo(this.position.x, this.position.y)
            ctx.lineTo(this.position.x + this.velocity.x * this.drawVelocityLen, this.position.y + this.velocity.y * this.drawVelocityLen)
    
            ctx.fill()
            ctx.stroke()
    
            ctx.closePath()
        }

        if (this.inCursor && this.drawInCursorLine)
        {
            ctx.beginPath()

            ctx.fillStyle = this.fillColor
            ctx.strokeStyle = this.strokeColor

            ctx.lineWidth = 1

            let vec = Vector2.Minus(this.position, UserMouse.position)
            vec = Vector2.Multiply(vec.normalized, UserMouse.r - vec.length)

            ctx.moveTo(this.position.x, this.position.y)
            ctx.lineTo(this.position.x + vec.x, this.position.y + vec.y)
    
            ctx.fill()
            ctx.stroke()
    
            ctx.closePath()
        }
    }

    update()
    {
        // this.inCursor = false

        if (this.velocity.length > Math.sqrt(2))
        {
            this.velocity = Vector2.Multiply(this.velocity, 0.99)
        }

        if (Vector2.Distance(UserMouse.position, this.position) < UserMouse.r + this.r)
        {
            let dist = Vector2.Distance(UserMouse.position, this.position) - this.r
            let vec = Vector2.Minus(this.position, UserMouse.position)

            if (!UserMouse.AntiGravity)
            vec = Vector2.Minus(UserMouse.position, this.position)

            let percent = 1 - dist/UserMouse.r
            vec = Vector2.Multiply(vec, percent * 0.005)

            this.velocity = Vector2.Plus(this.velocity, vec)

            if (!this.inCursor && this.eatable) 
            UserMouse.r += this.r
            
            this.inCursor = true
        }
        else
        {
            if (this.inCursor && this.eatable)
            UserMouse.r -= this.r

            this.inCursor = false
        }

        if (this.collision)
        {
            Objects.forEach(obj => {
                if (obj === this) return
    
                if (Vector2.Distance(obj.position, this.position) < this.r + obj.r)
                {
                    let vec = Vector2.Minus(obj.position, this.position).normalized
                    obj.velocity = Vector2.Multiply(vec, obj.velocity.length)

                    vec = Vector2.Minus(this.position, obj.position).normalized
                    this.velocity = Vector2.Multiply(vec, this.velocity.length)
                }
            })
        }
        
        if (this.position.x - this.r <= 0)
        {
            this.velocity.x = this.velocity.x * -1
        }
        
        if (this.position.x + this.r >= window.innerWidth)
        {
            this.velocity.x = this.velocity.x * -1
        }
        
        if (this.position.y - this.r <= 0)
        {
            this.velocity.y = this.velocity.y * -1
        }
        
        if (this.position.y + this.r >= window.innerHeight)
        {
            this.velocity.y = this.velocity.y * -1
        }

        this.position = Vector2.Plus(this.position, this.velocity)
    }
}

class Cursor extends Circle
{
    constructor(x, y, r)
    {
        super(x, y, r)
        this.fillColor = "rgba(0, 0, 0, 0)"
        this.AntiGravity = true
    }

    draw()
    {
        ctx.beginPath()

        ctx.fillStyle = this.fillColor
        ctx.strokeStyle = this.strokeColor

        ctx.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fill()

        ctx.closePath()
    }

    update()
    {
        let x = Input.MouseX - this.position.x
        let y = Input.MouseY - this.position.y

        this.velocity = new Vector2(x, y)
        this.velocity = Vector2.Multiply(this.velocity, 0.25)

        this.position = Vector2.Plus(this.position, this.velocity)
    }
}

