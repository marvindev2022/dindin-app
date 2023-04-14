import { useEffect, useState } from "react";
import ArrowDown from "../../assets/arrow-down.svg";
import ArrowUp from "../../assets/arrow-up.svg";
import DeleteIcon from "../../assets/delete-icon.svg";
import EditIcon from "../../assets/edit-icon.svg";
import api from "../../services/api";
import {
  formatToDate,
  formatToMoney,
  formatToWeekDay,
} from "../../utils/formatters";
import { notifyError, notifySucess } from "../../utils/notifications";
import { loadTransactions } from "../../utils/requisitions";
import { getItem } from "../../utils/storage";
import Confirm from "../Confirm";
import "./styles.css";

function Table({
  transactions,
  setTransactions,
  setOpenModalEdit,
  setCurrentItemToEdit,
}) {
  const token = getItem("token");

  const [asc, setAsc] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [orderedTransactions, setOrderedTransactions] = useState([]);

  function handleOpenConfirm(transact) {
    setCurrentItem(transact);
    setOpenConfirm(!openConfirm);
  }

  async function handleDeleteItem() {
    try {
      const response = await api.delete(`/transacao/${currentItem.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status > 204) {
        return notifyError(response.data);
      }

      notifySucess("Transação excluída.");

      const allTransactions = await loadTransactions();

      setTransactions([...allTransactions]);
    } catch (error) {
      notifyError(error.response.data);
    } finally {
      setOpenConfirm(false);
    }
  }

  function handelOpenEdit(transact) {
    setOpenModalEdit(true);
    setCurrentItemToEdit(transact);
  }

  useEffect(() => {
    const localTransactions = [...transactions];

    if (asc) {
      localTransactions.sort((a, b) => new Date(a.data) - new Date(b.data));
      setOrderedTransactions([...localTransactions]);
      return;
    }

    localTransactions.sort((a, b) => new Date(b.data) - new Date(a.data));
    setOrderedTransactions([...localTransactions]);
  }, [asc, transactions]);

  return (
    <div className="container-table">
      <div className="table-head">
        <div
          className="table-column-small content-date"
          onClick={() => setAsc(!asc)}
        >
          <strong>Data</strong>
          <img src={asc ? ArrowUp : ArrowDown} alt="order" />
        </div>
        <strong className="table-column-middle">Dia da semana</strong>
        <strong className="table-column-big">Descrição</strong>
        <strong className="table-column-small">Categoria</strong>
        <strong className="table-column-small">Valor</strong>
        <div className="table-column-small"></div>
      </div>

      <div className="table-body">
        {orderedTransactions.map((transact) => {
          return(
          <div className="table-row" key={transact.id}>
            <strong className="table-column-small content-date">
              {formatToDate(transact.data)}
            </strong>
            <span className="table-column-middle">
              {formatToWeekDay(transact.data)}
            </span>
            <span className="table-column-big">
              {transact.descricao === "" ? "-" : transact.descricao}
            </span>
            <span className="table-column-small">
              {transact.categoria_nome}
            </span>
            <strong
              className={`table-column-small values ${
                transact.tipo === "entrada"
                  ? "positive-value"
                  : "negative-value"
              }`}
            >
              {parseFloat(Number(formatToMoney(transact.valor) / 100))
                .toFixed(2)
                .replace(".", ",")}
            </strong>
            <div className="table-column-small action-buttons">
              <img
                src={EditIcon}
                alt="edit"
                onClick={() => handelOpenEdit(transact)}
              />
              <img
                src={DeleteIcon}
                alt="delete"
                onClick={() => handleOpenConfirm(transact)}
              />
            </div>
            <Confirm
              open={openConfirm && transact.id === currentItem.id}
              handleClose={() => setOpenConfirm(false)}
              handleConfirm={handleDeleteItem}
            />
          </div>
        )})}
      </div>
    </div>
  );
}

export default Table;
