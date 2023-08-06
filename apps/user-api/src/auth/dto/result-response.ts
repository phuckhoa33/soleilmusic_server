export class ResultResponse {
    statusCode: any
    message: string
    access_token: string
    refresh_token: string
    user: User
}

class User {
    id: number
    email: string
    first_name: string
    last_name: string 
    image: string 
    code: string
}