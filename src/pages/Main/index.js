import { useEffect, useState } from "react";
import "./styles.css";
import Header from "../../components/Header";
import Filter from "../../components/Filter";
import Table from "../../components/Table";
import Resume from "../../components/Resume";
import AddTransactionModal from "../../components/AddTransactionModal";
import EditTransactionModal from "../../components/EditTransactionModal";
import ProfileModal from "../../components/ProfileModal";
import { loadTransactions } from "../../utils/requisitions";

function Main() {
  const [openModalProfile, setOpenModalProfile] = useState(false);
  const [openModalAddTransaction, setOpenModalAddTransaction] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [currentItemToEdit, setCurrentItemToEdit] = useState(null);

  useEffect(() => {
    async function fetchTransactions() {
      const allTransactions = await loadTransactions();
      setTransactions(allTransactions);
    }
    fetchTransactions();
  }, []);

  return (
    <div className="container-main">
      <Header handleEditProfile={() => setOpenModalProfile(true)} />
      <section>
        <div className="width-limit">
          <div className="container-data">
            <div className="container-left">
              <Filter
                transactions={transactions}
                setTransactions={setTransactions}
              />
              <Table
                transactions={transactions}
                setTransactions={setTransactions}
                setOpenModalEdit={setOpenModalEdit}
                setCurrentItemToEdit={setCurrentItemToEdit}
              />
            </div>
            <div className="container-right">
              <Resume transactions={transactions} />
              <button
                className="btn-purple btn-small"
                onClick={() => setOpenModalAddTransaction(true)}
              >
                Adicionar Registro
              </button>
            </div>
          </div>
        </div>
      </section>
      <AddTransactionModal
        open={openModalAddTransaction}
        handleClose={() => setOpenModalAddTransaction(false)}
        setTransactions={setTransactions}
      />
      <EditTransactionModal
        open={openModalEdit}
        setTransactions={setTransactions}
        handleClose={() => setOpenModalEdit(false)}
        currentItemToEdit={currentItemToEdit}
      />
      <ProfileModal
        open={openModalProfile}
        handleClose={() => setOpenModalProfile(false)}
      />
    </div>
  );
}

export default Main;
