import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getCabins } from "../../services/apiCabins";
import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

export default function CabinTable() {
  const {
    isLoading,
    data: cabins,
    error,
    isError,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  const [searchParams] = useSearchParams();

  // Filtering
  const filterValue = searchParams.get("discount") || "all";

  // Sorting
  const sortBy = searchParams.get("sortBy") || "name-asc";

  // Handle loading and error states
  if (isLoading) return <Spinner />;

  if (isError) {
    return <p>{error.message}</p>;
  }

  // Filter cabins
  let filteredCabins;

  if (filterValue === "all") {
    filteredCabins = cabins;
  }

  if (filterValue === "no-discount") {
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  }

  if (filterValue === "with-discount") {
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);
  }

  // Sort cabins
  const [field, direction] = sortBy.split("-");

  const sortedCabins = [...filteredCabins].sort((a, b) => {
    const modifier = direction === "asc" ? 1 : -1;

    if (field === "name") {
      return a[field].localeCompare(b[field]) * modifier;
    }

    return (a[field] - b[field]) * modifier;
  });

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header role="row">
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
        </Table.Header>

        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        />
      </Table>
    </Menus>
  );
}
