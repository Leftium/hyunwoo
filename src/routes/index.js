import { GCP_API_KEY, SPREADSHEET_ID } from '$env/static/private';

export async function GET() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/get?range=A1:ZZ999999&key=${GCP_API_KEY}`;

    const response = await fetch(url);
    const json = await response.json()

    return {
        body: {
            data: json
        }
    }
}