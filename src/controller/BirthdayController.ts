import { Request, Response } from "express";
import {insertUserBirthdayInfo, findUserById} from "../service/BirthdayService";
import UserBirthdayData from '../interface/UserBirthdayData';


class DateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DateError";
    }
}

const parseBirthDate = (birthdate: string) => {
    let timestamp: number;
    if (Date.parse(birthdate)) {
        timestamp = Date.parse(birthdate);
    } else {
        throw new DateError("cannot parse Date. Incorrect Date format.");
    }
    return timestamp;
}

// endpoint: /birthday/

const postUserBirthdayInfo = async (req: Request, res: Response) => {

    const {firstname, lastname, birthdate} = req.body;
    
    console.log("Hello " + firstname);
    let timestamp: number;
    try {
        timestamp = parseBirthDate(birthdate);

        const date: Date = new Date(timestamp);

        await insertUserBirthdayInfo(firstname,lastname,date);
        res.status(200).send({
            firstname: firstname,
            lastname: lastname,
            birthday: date
        });
    } catch(err) {
        if (err instanceof Error) {
            res.status(500).send({
                errorType: err.name,
                errorMsg: err.message
            });
        }
    }
    
}

// /birthday/:userId
const fetchUserById = async (req: Request, res: Response) => {
    let userBirthday: UserBirthdayData;
    if (req.params && req.params.userId) {
       const result = await findUserById(req.params.userId);
        userBirthday = {
            firstname: result?.firstname
        }
       console.log("userBirthday: " + userBirthday)
       res.status(200).send({
            userMsg: userBirthday
       });
    }
}

export { 
    postUserBirthdayInfo, 
    fetchUserById 
};