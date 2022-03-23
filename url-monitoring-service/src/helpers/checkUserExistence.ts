import jwt from "jsonwebtoken";
import HttpClient from 'http-client';

export async function checkUserExsitence(token:string) {
    try {
        const httpClient = new HttpClient()
        const decodedToken:any = jwt.decode(token);
        //fetchUserById to check for existence in db
        const user:any = await httpClient.get(`${process.env.AUTH_SERVICE_URL}/users/${decodedToken.userId}`);
        if(user == null){
            return null;
        }else{
            return user?.data?.liteResponse;
        }   
    } catch (error) {
        console.debug("Error occurred while fetching user by id", error);
    }
}