import { useEffect, useState } from "react";
import CloseIcon from "../../assets/close-icon.svg";
import api from "../../services/api";
import { formatToDate } from "../../utils/formatters";
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

function EditTransactionModal({
  open,
  handleClose,
  setTransactions,
  currentItemToEdit,
}) {
  const token = getItem("token");

  const [option, setOption] = useState("out");
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ ...defaultForm });

  function handleChangeForm({ target }) {
    setForm({ ...form, [target.name]: target.value });
  }

  function handleChangeSelect({ target }) {
    const currentyCategory = categories.find(
      (categorie) => categorie.descricao === categorie.value
    );

    if (!currentyCategory) {
      return;
    }

    setForm({
      ...form,
      category: { id: currentyCategory.id, name: currentyCategory.descricao },
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const [day, month, year] = form.date.split("/");

    try {
      const response = await api.put(
        `/transacao/${currentItemToEdit.id}`,
        {
          tipo: option === "in" ? "entrada" : "saida",
          descricao: form.description,
          valor: form.value,
          data: new Date(`${year}-${month}-${day}`),
          categoria_id: form.category.id,
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

      notifySucess("Transação atualizada.");

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

  useEffect(() => {
    if (currentItemToEdit) {
      const { categoria_id, categoria_nome, data, descricao, tipo, valor } =
        currentItemToEdit;

      setForm({
        value: valor,
        category: {
          id: categoria_id,
          name: categoria_nome,
        },
        date: formatToDate(data),
        description: descricao,
      });

      setOption(tipo === "entrada" ? "in" : "out");
    }
  }, [currentItemToEdit]);

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
            <h2>Editar Registro</h2>
            <div className="container-options">
              <button
                className={`${option === "out" ? "option-off" : "option-in"}
                                   btn-big`}
                onClick={() => setOption("in")}
              >
                Entrada
              </button>
              <button
                className={`${option === "out" ? "option-out" : "option-off"}
                               btn-big`}
                onClick={() => setOption("out")}
              >
                Saída
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="container-inputs">
                <label>Valor </label>
                <b></b>
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
                  <option>Selecione</option>
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
                  required
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

export default EditTransactionModal;
