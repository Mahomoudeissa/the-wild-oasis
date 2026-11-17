import { supabase } from "/src/services/supabase.js";
import { PAGE_SIZE } from "../utils/constants";
export async function getBookings({ filter, sortBy, page }) {
  let query = supabase.from("bookings").select(
    `
    id,
    created_at,
    startDate:start_date,
    endDate:end_date,
    numNights:num_nights,
    numGuests:num_guests,
    totalPrice:total_price,
    status,
    cabins(name),
    guests(fullName, email)
  `,
    { count: "exact" },
  );
  // FILTER
  if (filter !== null) {
    query = query.eq(filter.field, filter.value);
  }

  // SORT
  if (sortBy) {
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });
  }

  // PAGINATION
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return { data, count };
}
export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// 3. تحديث حالة الحجز (مثلاً عند الـ Check-in أو Check-out)
export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  return data;
}
export async function deleteBooking(id) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
}
