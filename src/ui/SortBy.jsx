import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "start_date-desc";
  function handleChange(e) {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("sortBy", e.target.value);
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  }

  return (
    <Select
      options={options}
      type="white"
      value={sortBy}
      onChange={handleChange}
    />
  );
}

SortBy.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default SortBy;
