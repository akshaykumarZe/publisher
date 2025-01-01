const { Kafka } = require('kafkajs');
require('dotenv').config();

// Kafka configuration from environment variables
const kafka = new Kafka({
    clientId: 'nodejs-publisher',
    brokers: [process.env.KAFKA_BROKER || "my-cluster-kafka-bootstrap.kafka:9092"],
    sasl: {
        mechanism: "scram-sha-512",
        username: process.env.KAFKA_SASL_USERNAME, // SASL username
        password: process.env.KAFKA_SASL_PASSWORD, // SASL password
    },
});

const producer = kafka.producer();
const topic = process.env.KAFKA_TOPIC;
const text = process.env.PUBLISH_TEXT;
const number = process.env.PUBLISH_NUMBER;

// Function to publish a message to Kafka
const publishMessage = async () => {
    try {
        await producer.connect();
        console.log(`Connected to Kafka broker`);

        // Publish message every 5 seconds
        setInterval(async () => {
            const message = {
                text: text,
                number: Number(number)
            };

            await producer.send({
                topic: topic,
                messages: [{ value: JSON.stringify(message) }],
            });

            console.log(`Published message: ${JSON.stringify(message)} to topic: ${topic}`);
        }, 5000);

    } catch (error) {
        console.error('Error publishing message:', error);
    }
};

// Start publishing
publishMessage();
