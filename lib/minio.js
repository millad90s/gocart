import * as Minio from 'minio'

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
})

const bucketName = process.env.MINIO_BUCKET || 'soulynjewelry'

// Initialize bucket on startup
const initializeBucket = async () => {
    try {
        const exists = await minioClient.bucketExists(bucketName)
        if (!exists) {
            await minioClient.makeBucket(bucketName, 'us-east-1')
            console.log(`MinIO bucket '${bucketName}' created`)
        }
        
        // Always set public policy for the bucket to allow read access
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { AWS: ['*'] },
                    Action: ['s3:GetObject'],
                    Resource: [`arn:aws:s3:::${bucketName}/*`],
                },
            ],
        }
        await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy))
        console.log(`MinIO bucket '${bucketName}' policy set to public-read`)
    } catch (error) {
        console.error('MinIO initialization error:', error)
    }
}

// Initialize bucket (will run when module is imported)
initializeBucket()

export { minioClient, bucketName }
