import React, { useState, useEffect } from "react";
import { Box, Flex, Progress, useDisclosure } from "@chakra-ui/react";
import { Input } from "antd";
const { Search } = Input;
import Heading from "../../../components/text/Heading";
import Container from "../../../components/container/Container";
import Table from "../../../components/table";
import { columns } from "./fragments/dataTable";
import ButtonAdd from "../../../components/button/ButtonAdd";
import ModalAdd from "./fragments/ModalAdd";
import {
  kamarSelector,
  searchNomorKamar,
  getAllDataKamar,
} from "../../../utils/store/reducers/kamarSlice";
import { getAllTipeKamar } from "../../../utils/store/reducers/tipeKamarSlice";
import { useSelector, useDispatch } from "react-redux";

export default function index() {
  const dispatch = useDispatch();
  const kamar = useSelector(kamarSelector.selectAll);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = async (value) => {
    setLoading(true);
    await dispatch(searchNomorKamar(value));
    setLoading(false);
  };

  const getData = async () => {
    setLoading(true);
    await dispatch(getAllDataKamar());
    await dispatch(getAllTipeKamar());
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [dispatch]);

  return (
    <Container>
      <ModalAdd isOpen={isOpen} onClose={onClose} />
      <Heading text="Kelola Kamar" />
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        my={5}
        gap={5}
        flexDir={{ base: "column", md: "row" }}
      >
        <ButtonAdd heading={"Tambah Kamar"} onclick={onOpen} />
        <Box w={{ base: "full", md: "auto" }}>
          <Search
            placeholder="Cari Nomor Kamar"
            onChange={(e) => {
              if (e.target.value === "") {
                getData();
              } else {
                handleSearch(e.target.value);
              }
            }}
            style={{ width: "100%" }}
            allowClear={true}
          />
        </Box>
      </Flex>
      <Box my={10} maxW={"100%"}>
        {loading ? (
          <Progress size="xs" isIndeterminate />
        ) : (
          <Box w={"100%"}>
            <Table
              columns={columns}
              data={kamar}
              pagination={{
                position: ["bottomRight"],
                defaultPageSize: 5,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "15", "20"],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} dari ${total} items`,
              }}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}
