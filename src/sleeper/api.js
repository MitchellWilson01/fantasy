export const getUserId = async (username) => {
  let response = await fetch('https://api.sleeper.app/v1/user/' + username)
  let jsonResponse = await response.json()
  return jsonResponse.user_id
}

export const getDraftsByUser = async (userId) => {
  let response = await fetch('https://api.sleeper.app/v1/user/' + userId + '/drafts/nfl/2021')
  return await response.json()
} 

export const getDraftById = async (draftId) => {
  let response = await fetch('https://api.sleeper.app/v1/draft/' + draftId)
  return await response.json()
}

export const getDraftPicks = async (draftId) => {
  let response = await fetch('https://api.sleeper.app/v1/draft/' + draftId + '/picks')
  return await response.json()
}