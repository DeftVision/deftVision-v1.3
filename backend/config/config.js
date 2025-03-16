require('dotenv').config();

const env = process.env.NODE_ENV || 'beta';

module.exports = {
    env,
    port: process.env.PORT || 8005,
    databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/DefaultDB',
    corsOrigins: process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',')
        : ['https://app.deftvision.io', 'https://beta.app.deftvision.io'],
    jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
    jwtExpiration: process.env.JWT_EXPIRATION || '7d',
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
        s3BucketName: process.env.S3_BUCKET_NAME || 'default_bucket',
    },
    sendGridApiKey: process.env.SENDGRID_API_KEY || 'default_sendgrid_key',
};

