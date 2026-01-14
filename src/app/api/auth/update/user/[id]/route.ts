// import { NextRequest, NextResponse } from 'next/server';
// import { prisma as db } from '@/lib/auth'
// import { encrypt } from '@/lib/security/encrypt'
// import { hashSync } from 'bcrypt'

// interface UpdateUserRequest {
//     cpf?: string
//     phone?: string;
// }

// export async function PUT(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         const body: UpdateUserRequest = await request.json();
//         const userId = params.id;

//         // Validate userId
//         if (!userId) {
//             return NextResponse.json(
//                 { error: 'User ID is required' },
//                 { status: 400 }
//             );
//         }

//         // Validate request body
//         if (!body || Object.keys(body).length === 0) {
//             return NextResponse.json(
//                 { error: 'No fields to update' },
//                 { status: 400 }
//             );
//         }

//         if (!body.cpf || !body.phone) {
//             return NextResponse.json(
//                 { error: 'CPF and phone are required' },
//                 { status: 400 }
//             );
//         }

//         const new_cpf = encrypt(process.env.PUBLIC_KEY!, body.cpf);
//         const new_phone_number = encrypt(process.env.PUBLIC_KEY!, body.phone);

//         const new_hash_cpf = hashSync(body.cpf, 10);
//         const new_hash_phone_number = hashSync(body.phone, 10);

//         await db.user.update({
//             where: { id: userId },
//             data: {
//                 cpfShowable: new_cpf,
//                 telefoneShowable: new_phone_number,
//                 cpf: new_hash_cpf,
//                 telefone: new_hash_phone_number
//             }
//         });

//         return NextResponse.json(
//             { message: 'User updated successfully', userId },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error('Update user error:', error);
//         return NextResponse.json(
//             { error: 'Failed to update user' },
//             { status: 500 }
//         );
//     }
// }