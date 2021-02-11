export function getTokenBody(): FormData {
  const formData = new FormData()
  formData.append('client_id', Config.AZURE_CLIENT_ID)
  formData.append('client_secret', Config.AZURE_CLIENT_SECRET)
  formData.append('username', Config.AZURE_USERNAME)
  formData.append('password', Config.AZURE_PASSWORD)
  formData.append('resource', Config.AZURE_RESOURCE)
  formData.append('grant_type', Config.AZURE_GRANT_TYPE)
  return formData
}
