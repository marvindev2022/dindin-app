import api from "../services/api";
import { getItem } from "./storage";
import { notifyErro } from "./../utils/notifications";

export async function loadCategories() {
  let token = "";

  token = getItem("token");

  try {
    const response = await api.get("/categoria", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const orderedCategories = response.data.sort((a, b) => a - b);

    return orderedCategories;
  } catch (error) {
    notifyErro(error.response);
  }
}

export async function loadTransactions() {
  const token = getItem("token");

  try {
    const response = await api.get("/transacoes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    notifyErro(error.response);
  }
}
