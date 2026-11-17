import styled from "styled-components";
import PropTypes from "prop-types";
import { formatCurrency } from "../../utils/helpers";
import { useDeleteCabin } from "../../hooks/useDeleteCabin";
import { useCreateEditCabin } from "../../hooks/useCreateCabin";
import { HiPencil, HiTrash } from "react-icons/hi";
import { HiSquare2Stack } from "react-icons/hi2";
import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import toast from "react-hot-toast";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;
export default function CabinRow({ cabin }) {
  const { id, name, maxCapacity, regularPrice, discount, image } = cabin;

  const { createCabin, isCreating } = useCreateEditCabin();
  const { isPending: isDeleting, mutate: deleteCabin } = useDeleteCabin();

  function handleDuplicate() {
    createCabin(
      {
        newCabin: {
          name: `copy ${name}`,
          maxCapacity,
          regularPrice,
          discount,
          image,
        },
      },
      {
        onSuccess: () => toast.success(`Cabin "${name}" duplicated`),
      },
    );
  }

  return (
    <Modal>
      <Table.Row role="row">
        <Img src={image} alt={`Cabin ${name}`} />
        <Cabin>{name}</Cabin>
        <div>Fits up to {maxCapacity} guests</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        <Discount>{discount ? formatCurrency(discount) : "—"}</Discount>

        <Menus.Menu>
          <Menus.Toggle id={id} />

          <Menus.List id={id}>
            <Modal.Open opens="edit">
              <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
            </Modal.Open>

            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open>

            <Menus.Button
              icon={<HiSquare2Stack />}
              onClick={handleDuplicate}
              disabled={isCreating}
            >
              Duplicate
            </Menus.Button>
          </Menus.List>
        </Menus.Menu>

        <Modal.Window name="edit">
          <CreateCabinForm cabinToEdit={cabin} />
        </Modal.Window>

        <Modal.Window name="delete">
          <ConfirmDelete
            resource="cabins"
            disabled={isDeleting}
            onConfirm={() => deleteCabin(id)}
          />
        </Modal.Window>
      </Table.Row>
    </Modal>
  );
}

CabinRow.propTypes = {
  cabin: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    maxCapacity: PropTypes.number,
    regularPrice: PropTypes.number,
    discount: PropTypes.number,
    image: PropTypes.string,
  }).isRequired,
};
