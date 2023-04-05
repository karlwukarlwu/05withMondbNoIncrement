const request = require('supertest');

const app = require('../../app');
// const app = express()
// 哪里有这个 express() 从哪里导入


// descibe test expect 都是jest的东西
describe('Test GET /launches', () => {
    // 这里你要是想用 await 的话就要用 async()=> 箭头函数
    test('It should respond with 200 success', async () => {
        // 这里的request是supertest的东西👇
        // const response =await request(app).get('/launches');
        // expect(response.statusCode).toBe(200);

        //更进一步 你可以用supertest 的request 和 expect来判断返回的东西
        const response = await request(app)
            .get('/launches')//这里是用get 来测这个endpoint
            .expect("Content-Type", /json/)//这里是用expect来判断的content-type是不是json
            .expect(200);//这里是用expect来判断的status code是不是200
    })
});

describe('Test POST /launch', () => {
    // 为什么要提取日期 因为日期的格式参数不一样
    const completeLaunchData = {
        mission: 'USS Enterprise',
        rocket: 'NCC-1701-D',
        target: 'Kepler-186 f',
        launchDate: 'January 4, 2028',
    }
    // 下面的使用方法只检查重复的properties 但是不检查多余的properties
    const launchDataWithoutDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC-1701-D',
        target: 'Kepler-186 f',
    }
    const launchDataWithInvalidDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC-1701-D',
        target: 'Kepler-186 f',
        launchDate: 'zoot',
    }

    test('It should respond with 201 created', async () => {
        const response = await request(app)
            .post('/launches')
            .send(
                completeLaunchData
            )
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();

        expect(responseDate).toBe(requestDate)
        // 我们只需要把requestDate和responseDate 单独转化成Date 类型比较就可以了

        expect(response.body).toMatchObject(launchDataWithoutDate);
        //     body多余的部分不管 只关注重复的部分是不是property 相同
        //     In other words, the toMatchObject() method checks that the actual object
        //     contains all the properties of the expected object and
        //     their corresponding values match, but it does not care about
        //     any additional properties that may be present in the actual object.
    })
    test("It should catch missing required properties", async () => {
        const response = await request(app)
            .post('/launches')
            // 这里是举个例子少launchDate 但是你可以少任何别的property
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

        // The toStrictEqual() method in Jest is used to test that
        // two objects are strictly equal, meaning they have
        // the exact same properties and values, and are of the same type.
        expect(response.body).toStrictEqual({
            error: 'Missing required launch property'
        })
    })

    test("It should catch invalid dates", async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error:"Invalid launch date"
        })
    })
});

