import { supabase, supabaseUrl } from "/src/services/supabase.js";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    throw new Error("Cabins could not be loaded");
  }

  console.log("Cabins fetched:", data);

  return data;
}

export async function createEditCabin(newCabin, id) {
  const isNewImage = newCabin.image instanceof File;

  const hasImagePath =
    typeof newCabin.image === "string" &&
    newCabin.image.startsWith(supabaseUrl);

  const imageName = isNewImage
    ? `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "")
    : null;

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabinImages/${imageName}`;

  console.log("Payload sent to Supabase:", {
    ...newCabin,
    image: imagePath,
  });

  let query = supabase.from("cabins");

  if (!id) {
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }

  if (id) {
    query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabinImages")
    .upload(imageName, newCabin.image);
  if (storageError) {
    console.error(storageError);
    throw new Error(storageError.message);
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}

// export async function createCabin(newCabin) {
//   const { data, error } = await supabase
//     .from("cabins")
//     .insert([newCabin])
//     .select()
//     .single();

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// }
