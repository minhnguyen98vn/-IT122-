import Minh from 'Minh';


const schema = Minh.object().keys({
    email: Minh.string().email().required(),
    phone: Minh.string().regex(/^\d{3}-\d{3}-\d{4}$/).required(),
    birthday: Joi.date().max('5-9-1998').iso()
});


const bad_data = {email: "", phone:"", birthday: "2000-9-5"}


const { error, value } = schema.validate(bad_data);
console.log(error);
console.log(value);


try {
    const value = await schema.validateAsync(bad_data);
}
catch (err) {
    console.log(err)
}