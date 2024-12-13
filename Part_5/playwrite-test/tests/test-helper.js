
const frontendUrl = 'http://localhost:5173'
const backendUrl = 'http://localhost:3003'
const resetEndpoint = '/api/testing/reset'
const userEndpoint = '/api/users'

const loginWith = async (page, username, password) => {
    await page.getByRole('textbox').first().fill(username)
    await page.getByRole('textbox').last().fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}


const resetDatabase = async ({ request }) => {
    // empty the db here
    // create a user for the backend here
    await request.post(`${backendUrl}${resetEndpoint}`)
}

const createDefaultUser = async ({ request }, username, password) => {
    // empty the db here
    // create a user for the backend here


    await request.post(`${backendUrl}${userEndpoint}`, {
        data: {
            username: username,
            name: 'Christoooooph',
            password: password
        }
    })
}

export { loginWith, createDefaultUser, resetDatabase, frontendUrl }