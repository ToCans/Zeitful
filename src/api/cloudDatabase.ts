// Tries to import a json file as a database
export async function importCloudDatabaseCredentialile(file: File) {
    const text = await file.text();
    const jsonData = JSON.parse(text);
    console.log(jsonData);
}
