import { useEffect, useState } from "react";
import FilterIcon from "../../assets/filter-icon.svg";
import Chip from "../Chip";
import "./styles.css";
import { loadCategories, loadTransactions } from "../../utils/requisitions";

function Filter({ _, setTransactions }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  async function handleClearFilters() {
    let localCategories = [...categories];
    localCategories.forEach((category) => (category.checked = false));
    setCategories([...localCategories]);

    let allTransactions = await loadTransactions();
    setTransactions([...allTransactions]);
  }

  async function handleApplyFilters() {
    let localTransactions = await loadTransactions();
    let categoriesCheckedId = categories
      .filter((category) => category.checked)
      .map((category) => category.id);

    if (categoriesCheckedId.length) {
      localTransactions = localTransactions.filter((transaction) =>
        categoriesCheckedId.includes(transaction.categoria_id)
      );
    }

    setTransactions([...localTransactions]);
  }

  useEffect(() => {
    async function loadAllCategories() {
      const allCategories = await loadCategories();
      allCategories.forEach((category) => {
        category.checked = false;
      });
      setCategories([...allCategories]);
    }

    if (open) {
      loadAllCategories();
    }
  }, [open]);

  return (
    <div className="container-filter">
      <button className="btn-white btn-filter" onClick={() => setOpen(!open)}>
        <img src={FilterIcon} alt="filter" />
        Filtrar
      </button>

      {open && (
        <div className="filter-body">
          <strong>Categoria</strong>
          <div className="container-categories">
            {categories.map((category) => (
              <Chip
                key={category.id}
                checked={category.checked}
                title={category.descricao}
                id={category.id}
                categories={categories}
                setCategories={setCategories}
              />
            ))}
          </div>
          <div className="container-btns-filter">
            <button
              className="btn-white btn-extra-small"
              onClick={handleClearFilters}
            >
              Limpar Filtros
            </button>
            <button
              className="btn-purple btn-extra-small"
              onClick={handleApplyFilters}
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Filter;
