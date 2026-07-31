// import { NextResponse } from 'next/server';
// import formidable from 'formidable';
// import fs from 'fs';
// import { uploadPdfRaw } from '@/lib/cloudinary';

// export const config = { api: { bodyParser: false } };

// export async function POST(req) {
//   const form = new formidable.IncomingForm({ maxFileSize: 200 * 1024 }); // 200KB

//   return new Promise((resolve) => {
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         return resolve(
//           NextResponse.json({ error: 'Upload error or file too large' }, { status: 400 })
//         );
//       }
      
//       const file = files.file;
//       if (!file || file.mimetype !== 'application/pdf') {
//         return resolve(
//           NextResponse.json(
//             { error: 'Only PDF up to 200KB allowed' },
//             { status: 400 }
//           )
//         );
//       }

//       try {
//         const buffer = fs.readFileSync(file.filepath);
//         const url = await uploadPdfRaw(buffer, file.originalFilename);
//         resolve(NextResponse.json({ url }));
//       } catch (uploadError) {
//         resolve(
//           NextResponse.json(
//             { error: 'Upload failed' },
//             { status: 500 }
//           )
//         );
//       }
//     });
//   });
// }


import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import { uploadPdfRaw } from '@/lib/cloudinary';

export const routeSegmentConfig = { api: { bodyParser: false } };

export async function POST(req) {
  const form = new formidable.IncomingForm({ maxFileSize: 200 * 1024 }); // 200KB

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return resolve(
          NextResponse.json({ error: 'Upload error or file too large' }, { status: 400 })
        );
      }
      
      const file = files.file;
      if (!file || file.mimetype !== 'application/pdf') {
        return resolve(
          NextResponse.json(
            { error: 'Only PDF up to 200KB allowed' },
            { status: 400 }
          )
        );
      }

      try {
        const buffer = fs.readFileSync(file.filepath);
        const url = await uploadPdfRaw(buffer, file.originalFilename);
        resolve(NextResponse.json({ url }));
      } catch (uploadError) {
        resolve(
          NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
          )
        );
      }
    });
  });
}
