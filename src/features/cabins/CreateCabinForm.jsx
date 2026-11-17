import styled from "styled-components";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import { useCreateEditCabin } from "../../hooks/useCreateCabin";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { cabinSchema } from "./cabinSchema";
import { Controller } from "react-hook-form";
import FileInput from "../../ui/FileInput";
import PropTypes from "prop-types";

const FormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;
  padding: 1.2rem 0;

  &:has(input[type="file"]) {
    grid-template-columns: 24rem 1fr;
    align-items: start;
  }

  &:has(input[type="file"]) > div {
    display: flex;
    flex-direction: column;
  }

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;
const Label = styled.label`
  font-weight: 500;
`;
const Error = styled.p`
  color: var(--color-red-700);
  font-size: 1.2rem;
  margin-top: 0.6rem;
`;
function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabinToEdit;

  const isEditedSession = Boolean(editId);
  console.log({
    cabinToEdit,
    editId,
    isEditedSession,
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(cabinSchema),

    defaultValues: isEditedSession
      ? editValues
      : {
          name: "",
          maxCapacity: "",
          regularPrice: "",
          discount: 0,
          description: "",
          image: null,
        },
  });
  const { createCabin, isCreating } = useCreateEditCabin();
  function onSubmit(data) {
    createCabin(
      {
        newCabin: data,
        id: editId,
      },
      {
        onSuccess: () => {
          toast.success(
            isEditedSession
              ? "Cabin updated successfully!"
              : "Cabin created successfully!",
          );

          reset();
          onCloseModal?.();
        },
        onError: (error) => {
          toast.error(error.message || "Something went wrong!");
        },
      },
    );
  }
  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>

        <div>
          <Input type="text" id="name" {...register("name")} />

          {errors.name && <Error>{errors.name.message}</Error>}
        </div>
      </FormRow>

      <FormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>

        <div>
          <Input
            type="number"
            id="maxCapacity"
            {...register("maxCapacity", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />

          {errors.maxCapacity && <Error>{errors.maxCapacity.message}</Error>}
        </div>
      </FormRow>

      <FormRow>
        <Label htmlFor="regularPrice">Regular price</Label>

        <div>
          <Input
            type="number"
            id="regularPrice"
            {...register("regularPrice", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />

          {errors.regularPrice && <Error>{errors.regularPrice.message}</Error>}
        </div>
      </FormRow>

      <FormRow>
        <Label htmlFor="discount">Discount</Label>

        <div>
          <Input
            type="number"
            id="discount"
            {...register("discount", {
              setValueAs: (value) => (value === "" ? 0 : Number(value)),
            })}
          />

          {errors.discount && <Error>{errors.discount.message}</Error>}
        </div>
      </FormRow>

      <FormRow>
        <Label htmlFor="description">Description for website</Label>

        <div>
          <Textarea id="description" {...register("description")} />
          {errors.description && <Error>{errors.description.message}</Error>}
        </div>
      </FormRow>
      <FormRow>
        <Label htmlFor="image">Cabin image</Label>
        <Controller
          name="image"
          control={control}
          render={({ field, fieldState }) => (
            <FileInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={fieldState.error?.message}
            />
          )}
        />
      </FormRow>
      <FormRow>
        <Button
          variation="secondary"
          type="button"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isCreating}>
          {isEditedSession ? "Edit Cabin" : "Add cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
CreateCabinForm.propTypes = {
  cabinToEdit: PropTypes.object,
  onCloseModal: PropTypes.func,
};
