import { useEffect, useState } from "react";
import CloseIcon from "../../assets/close-icon.svg";
import api from "../../services/api";
import { notifyError, notifySucess } from "../../utils/notifications";
import { loadCategories, loadTransactions } from "../../utils/requisitions";
import { getItem } from "../../utils/storage";
import "./styles.css";

const defaultForm = {
  value: "",
  category: {
    id: "",
    name: "",
  },
  date: "",
  description: "",
};

function AddTransactionModal({ open, handleClose, setTransactions }) {
  const token = getItem("token");

  const [option, setOption] = useState("out");
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ ...defaultForm });

  function handleChangeForm({ target }) {
    setForm({ ...form, [target.name]: target.value });
  }

  function handleChangeSelect({ target }) {
    const currentyCategory = categories.find(
      (categorie) => categorie.descricao === target.value
    );

    if (currentyCategory) {
      setForm({
        ...form,
        category: { id: currentyCategory.id, name: currentyCategory.descricao },
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let day;
    let month;
    let year;
    if (form.date.length === 8) {
      day = `${form.date[0]}${form.date[1]}`;
      month = `${form.date[2]}${form.date[3]}`;
      year = `${form.date[4]}${form.date[5]}${form.date[6]}${form.date[7]}`;
    } else {
      day = `${form.date[0]}${form.date[1]}`;
      month = `${form.date[3]}${form.date[4]}`;
      year = `${form.date[6]}${form.date[7]}${form.date[8]}${form.date[9]}`;
    }

    try {
      const response = await api.post(
        "/transacao",
        {
          tipo: option === "in" || !option ? "entrada" : "saida",
          descricao: form.description,
          valor: form.value,
          data: new Date(`${year}-${month}-${day}`),
          categoria_id: "1",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status > 204) {
        return notifyError(response.data);
      }

      notifySucess("Transação adicionada.");

      handleClose();
      setForm({ ...defaultForm });

      const allTransactions = await loadTransactions();

      setTransactions([...allTransactions]);
    } catch (error) {
      notifyError(error.response.data);
    }
  }

  useEffect(() => {
    async function getCategories() {
      const allCategories = await loadCategories();

      setCategories([...allCategories]);
    }

    getCategories();
  }, []);

  return (
    <>
      {open && (
        <div className="backdrop">
          <div className="modal">
            <img
              className="close-button"
              src={CloseIcon}
              alt="close-button"
              onClick={handleClose}
            />
            <h2>Adicionar Registro</h2>
            <div className="container-options">
              <button
                className={`btn-big ${
                  option === "in" ? "option-in" : "option-off"
                }`}
                onClick={() => setOption("in")}
              >
                Entrada
              </button>
              <button
                className={`btn-big ${
                  option === "out" ? "option-out" : "option-off"
                }`}
                onClick={() => setOption("out")}
              >
                Saída
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="container-inputs">
                <label>Valor</label>
                <input
                  name="value"
                  type="number"
                  value={form.value}
                  onChange={handleChangeForm}
                  required
                />
              </div>
              <div className="container-inputs">
                <label>Categoria</label>
                <select
                  name="category"
                  value={form.category.name}
                  onChange={handleChangeSelect}
                  required
                >
                  <option value="">Selecione</option>
                  {categories.map((categorie) => (
                    <option key={categorie.id} value={categorie.descricao}>
                      {categorie.descricao}
                    </option>
                  ))}
                </select>
              </div>
              <div className="container-inputs">
                <label>Data</label>
                <input
                  name="date"
                  type="text"
                  value={form.date}
                  onChange={handleChangeForm}
                  required
                />
              </div>
              <div className="container-inputs">
                <label>Descrição</label>
                <input
                  name="description"
                  type="text"
                  value={form.description}
                  onChange={handleChangeForm}
                />
              </div>
              <button className="btn-purple btn-small">Confirmar</button>
            </form>
          </div>
        </div>
      )}
    </>
  );

}

export default AddTransactionModal;
