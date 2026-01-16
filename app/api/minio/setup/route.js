import { NextResponse } from "next/server"
import { minioClient, bucketName } from "@/lib/minio"

export async function GET() {
    try {
        // Check if bucket exists
        const exists = await minioClient.bucketExists(bucketName)
        
        if (!exists) {
            // Create bucket
            await minioClient.makeBucket(bucketName, 'us-east-1')
        }
        
        // Set public policy
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
        
        // Get current policy to verify
        const currentPolicy = await minioClient.getBucketPolicy(bucketName)
        
        return NextResponse.json({
            success: true,
            bucketName,
            exists,
            policy: JSON.parse(currentPolicy)
        })
    } catch (error) {
        console.error('MinIO setup error:', error)
        return NextResponse.json(
            { error: 'Failed to setup MinIO', details: error.message },
            { status: 500 }
        )
    }
}
