import express from 'express'
import WebPush from 'web-push'
import cors from 'cors'
import bodyParser from 'body-parser'
import { z } from 'zod'  // server para se criar valid schema do json, se mapea os dados que se deseja trabalhar do json recebido

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//console.log(WebPush.generateVAPIDKeys())  -- para gerar as chaves publicKey e privateKey

const publicKey = 'BHUvY5Y5rUWET5sBexiU6ulKF-jm3zAp1CFlQA7XFJb25OWHdnfTXCpqLmOyVQRAApuOEW5dJC_2Vu9VHeGzkRU'
const privateKey = 'c6Bp-yPcczwBA2-bbT7hkvFakxy3r7HgSq9256dLmNE'

WebPush.setVapidDetails('http://localhost:3334', publicKey, privateKey)

app.get("/", (request, response) => {
    return response.json({
        message: "Olá Mundo 5!"
    })
})

app.get("/push/public_key", (request, response) => {
    return response.json({
        publicKey:  publicKey
    })
})


app.post("/push/register", (request, reply) => {
    // aqui fazer rotinas de registrar usuário
    return reply.status(201).send()
})

app.post("/push/send", async (request, reply) => {
    console.log(request.body)
    const sendPushBody = z.object({
        subscription : z.object({
            endpoint: z.string(),
            keys: z.object({
                p256dh: z.string(),
                auth: z.string()
            })
        })
    })

    const { subscription } = sendPushBody.safeParse(request.body)
    setTimeout(() => {
        WebPush.sendNotification(subscription, 'Estou vindo do back-end !')
    }, 5000)
    
    return reply.status(201).send()
})

app.listen(3334)

