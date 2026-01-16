import { NextResponse } from "next/server"
import { minioClient, bucketName } from "@/lib/minio"

export async function POST(request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file')
        const folder = formData.get('folder') || 'uploads'

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(7)
        const fileExt = file.name.split('.').pop()
        const fileName = `${timestamp}-${randomString}.${fileExt}`
        const filePath = `${folder}/${fileName}`

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer())

        // Upload to MinIO
        await minioClient.putObject(
            bucketName,
            filePath,
            buffer,
            buffer.length,
            {
                'Content-Type': file.type,
                'Cache-Control': 'max-age=31536000',
            }
        )

        // Generate public URL
        const minioEndpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'http://localhost:9000'
        const publicUrl = `${minioEndpoint}/${bucketName}/${filePath}`

        return NextResponse.json({
            url: publicUrl,
            path: filePath,
            fileName: fileName
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Upload failed', details: error.message },
            { status: 500 }
        )
    }
}

// DELETE endpoint to remove files
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const path = searchParams.get('path')

        if (!path) {
            return NextResponse.json(
                { error: 'No file path provided' },
                { status: 400 }
            )
        }

        await minioClient.removeObject(bucketName, path)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete error:', error)
        return NextResponse.json(
            { error: 'Delete failed', details: error.message },
            { status: 500 }
        )
    }
}
