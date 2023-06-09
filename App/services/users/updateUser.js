import { MS_USERS_BASE_URL } from "@env";
import { toSnakeCase } from "../../utils/string";
import { httpPut } from "./../httpPut";

export default async function updateUser(userId, userData, token) {
  userData = toSnakeCase(userData);
  userData.city = "Caraguatatuba";
  response = httpPut(`${MS_USERS_BASE_URL}/${userId}`, userData, token);

  return response;
}
