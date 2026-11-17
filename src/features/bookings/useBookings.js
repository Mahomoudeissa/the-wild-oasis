import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getBookings } from "../../services/apiBookings";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get("status");

  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "start_date-desc";
  const [field, direction] = sortByRaw.split("-");

  const sortBy = { field, direction };

  // PAGINATION
  const page = Number(searchParams.get("page") || 1);

  // QUERY
  const {
    isLoading,
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  // PRE-FETCHING
  useEffect(
    function () {
      // Wait until we have the total count
      if (count == null) return;

      const pageCount = Math.ceil(count / PAGE_SIZE);

      // PREFETCH NEXT PAGE
      if (page < pageCount) {
        queryClient.prefetchQuery({
          queryKey: ["bookings", filter, sortBy, page + 1],
          queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
        });
      }

      // PREFETCH PREVIOUS PAGE
      if (page > 1) {
        queryClient.prefetchQuery({
          queryKey: ["bookings", filter, sortBy, page - 1],
          queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
        });
      }
    },
    [queryClient, count, page, filterValue, field, direction],
  );

  return { isLoading, error, bookings, count };
}
