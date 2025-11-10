let message = "I love to eat ham and cheese"
let message2 = "I fucking bitch love to eat ham and cheese"

const profanities = ["fucking", "bitch"]

async function profanityCheck(message) {
    try {
    const res = await fetch('https://vector.profanity.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
    })

    const data = await res.json()
    return data.isProfanity || false  // Returns true if profane
    } catch (error) {
        console.error('Profanity check failed:', error)
        return false  // If API fails, allow message through
    }
 }

async function test() {
    // Test 1
    if (await profanityCheck(message)) {
        console.log("can't say that")
    } else {
        console.log(message)
    }
    
    // Test 2
    if (await profanityCheck(message2)) {
        console.log("can't say that")
    } else {
        console.log(message2)
    }
}

test()

