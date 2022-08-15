import { GCP_API_KEY, SPREADSHEET_ID } from '$env/static/private';

export async function GET() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/get?range=A1:ZZ999999&key=${GCP_API_KEY}`;

    const response = await fetch(url);
    const json = await response.json();

    const results = [];
    let headers;

    let _; // Dump unwanted data into this variable.

    for (const value of json.values) {
        if (!headers) {
            [_, _, ...headers] = value;
            continue;
        }
        const [latLng, address, ...otherDetails] = value

        const [lat, lng] = latLng.split(',').map(parseFloat)

        const info = new Map();
        headers.forEach((header, i) => {
            info.set(header, otherDetails[i] || 'n/a');
        });

        results.push({
            position: { lat, lng },
            info: Object.fromEntries(info)
        })
    }

    return {
        body: {
            data: results
        }
    }
}