import { NextRequest } from 'next/server';

import { LsRequest, LsResponse } from '@/lib/models/ingest';

export async function GET(): Promise<Response> {
  try {
    // const response = await fetch('https://api.example.com/users');
    // const data: User[] = await response.json();
    const data: LsResponse = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      }
    ]; // TODO

    return Response.json({
      data,
      status: 200
    });
  } catch (error) {
    return Response.json({
      error: 'Failed to fetch users',
      status: 500
    }, {
      status: 500
    });
  }
}

// export async function POST(
//   request: NextRequest
// ): Promise<Response> {
//   try {
//     const body: CreateUserRequest = await request.json();

//     // Validate request body
//     if (!body.name || !body.email) {
//       return Response.json({
//         error: 'Missing required fields',
//         status: 400
//       }, {
//         status: 400
//       });
//     }

//     const response = await fetch('https://api.example.com/users', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });

//     const user: User = await response.json();

//     return Response.json({
//       data: user,
//       status: 201
//     }, {
//       status: 201
//     });
//   } catch (error) {
//     return Response.json({
//       error: 'Failed to create user',
//       status: 500
//     }, {
//       status: 500
//     });
//   }
// }
