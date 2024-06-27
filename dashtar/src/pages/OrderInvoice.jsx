import dayjs from "dayjs";
import { useParams } from "react-router";
import ReactToPrint from "react-to-print";
import React, { useContext, useRef } from "react";
import { FiPrinter } from "react-icons/fi";
import { IoCloudDownloadOutline } from "react-icons/io5";
import {
  TableCell,
  TableHeader,
  Table,
  TableContainer,
  WindmillContext,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { PDFDownloadLink } from "@react-pdf/renderer";

//internal import
import useAsync from "@/hooks/useAsync";
import Status from "@/components/table/Status";
import OrderServices from "@/services/OrderServices";
import Invoice from "@/components/invoice/Invoice";
import Loading from "@/components/preloader/Loading";
import logoDark from "@/assets/img/logo/logo-dark.svg";
import logoLight from "@/assets/img/logo/logo-color.svg";
import PageTitle from "@/components/Typography/PageTitle";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import InvoiceForDownload from "@/components/invoice/InvoiceForDownload";
import SelectStatus from "@/components/form/selectOption/SelectStatus";
import useFilter from "@/hooks/useFilter";

const OrderInvoice = ({orders}) => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);
  const { id } = useParams();
  const printRef = useRef();

  //  const { dataTable } = useFilter(dashboardRecentOrder?.orders);

  const { data, loading, error } = useAsync(() =>
    OrderServices.getOrderById(id)
  );

  const {
    currency,
    globalSetting,
    showDateTimeFormat,
    showDateFormat,
    getNumberTwo,
  } = useUtilsFunction();

  return (
    <>
      <PageTitle> {t("InvoicePageTittle")} </PageTitle>

      <div
        ref={printRef}
        className="bg-white dark:bg-gray-800 mb-4 p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden"
      >
        {!loading && (
          <div className="">
            <div className="flex lg:flex-row md:flex-row flex-col lg:items-center justify-between pb-4 border-b border-[#f79813] dark:border-[#f79813] dark:text-gray-300">
              <div className="flex  flex-col gap-3">
                <h1 className="font-bold font-serif text-xl uppercase">
                  {t("InvoicePageTittle")}
                </h1>
                {/* INVOICE DATE */}
                <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                  <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                    {t("InvoiceDate")}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 block">
                    {showDateFormat(data?.createdAt)}
                  </span>
                </div>
                {/* INVOICE NUMBER */}
                <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                  <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                    {t("InvoiceNo")}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 block">
                    #{data?.invoice}
                  </span>
                </div>
                {/* SATATUS */}
                <p className="text-[18px] mb-2 text-gray-500">
                  {t("InvoiceStatus")}
                  <span className="pl-2 font-medium text-xs capitalize">
                    {" "}
                    <Status status={data.status} />
                  </span>
                </p>
              </div>
              {/* <div className="lg:text-right text-left">
                <h2 className="lg:flex lg:justify-end text-lg font-serif font-semibold mt-4 lg:mt-0 lg:ml-0 md:mt-0">
                  {mode === "dark" ? (
                    <img src={logoDark} alt="kachabazar" width="110" />
                  ) : (
                    <img src={logoLight} alt="kachabazar" width="110" />
                  )}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {globalSetting?.address} <br />
                  {globalSetting?.contact} <br />{" "}
                  <span> {globalSetting?.email} </span> <br />
                  {globalSetting?.website}
                </p>
              </div> */}
            </div>
            <div className="flex lg:flex-row md:flex-row flex-col justify-between pt-4">
              {/* <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoiceDate")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 block">
                  {showDateFormat(data?.createdAt)}
                </span>
              </div> */}
              {/* <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoiceNo")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 block">
                  #{data?.invoice}
                </span>
              </div> */}

              {/* CUSTOMER DETAILS */}
              <div className="flex flex-col lg:text-right text-left items-start justify-start">
                <span className="font-bold font-serif text-sm mb-2 uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoiceTo")} / {t("Customer Details")}
                </span>
                <span className="text-sm text-gray-500 text-left dark:text-gray-400 block">
                  <span className="font-extrabold"> Name: </span>{" "}
                  {data?.user_info?.name} <br />
                  <span className="font-extrabold"> Eamil: </span>{" "}
                  {data?.user_info?.email} <br />
                  <span className="font-extrabold"> Number: </span>{" "}
                  <span className="ml-2">{data?.user_info?.contact}</span>
                  <br />
                  <span className="font-extrabold"> Country: </span>{" "}
                  {data?.user_info?.address?.substring(0, 30)}
                  <br />
                  <span className="font-extrabold">
                    {" "}
                    City/Country/ZipCode:{" "}
                  </span>{" "}
                  {data?.user_info?.city}, {data?.user_info?.country},{" "}
                  {data?.user_info?.zipCode}
                </span>
              </div>
              {/* END OF CUSTOMER DETAILS */}

              {/* DISPATCH DETAILS */}
              <div className="lg:text-right text-left flex md:flex-row flex-col items-start md:items-center xl:items-center lg:items-center gap-2 md:mt-0 xl:mt-0 lg:mt-0 mt-5 md:gap-5  xl:gap-5 lg:gap-5 justify-start">
                <div className="px-2 py-8 rounded-[20px] bg-gray-200 dark:bg-slate-500">
                  <h2 className="lg:flex lg:justify-end text-lg font-serif font-semibold mt-4 lg:mt-0 lg:ml-0 md:mt-0">
                    {mode === "dark" ? (
                      <img src={logoDark} alt="kachabazar" width="70" />
                    ) : (
                      <img src={logoLight} alt="kachabazar" width="70" />
                    )}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 text-left dark:text-gray-400 mt-2">
                  <span className="font-bold font-serif text-sm mb-1 uppercase text-gray-600 dark:text-gray-500 block">
                    {t("Dispatch Details")}
                  </span>
                  <span className="font-extrabold"> Adress: </span>{" "}
                  {globalSetting?.address} <br />
                  <span className="font-extrabold"> Number: </span>{" "}
                  {globalSetting?.contact} <br />{" "}
                  <span className="font-extrabold"> Email: </span>{" "}
                  <span> {globalSetting?.email} </span> <br />
                  <span className="font-extrabold"> Website: </span>
                  {globalSetting?.website}
                </p>
              </div>
              {/* END OF DISPATCH DETAILS */}
            </div>
          </div>
        )}
        <div>
          {loading ? (
            <Loading loading={loading} />
          ) : error ? (
            <span className="text-center mx-auto text-red-500">{error}</span>
          ) : (
            <TableContainer className="my-8">
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>{t("Sr")}</TableCell>
                    <TableCell>Product Title</TableCell>
                    <TableCell className="text-center">
                      {t("Quantity")}
                    </TableCell>
                    <TableCell className="text-center">
                      {t("ItemPrice")}
                    </TableCell>
                    <TableCell className="text-right">{t("Amount")}</TableCell>
                  </tr>
                </TableHeader>
                <Invoice
                  data={data}
                  currency={currency}
                  getNumberTwo={getNumberTwo}
                />
              </Table>
            </TableContainer>
          )}
        </div>

        {!loading && (
          <div className="border rounded-xl border-gray-100 p-8 py-6 bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex lg:flex-row md:flex-row flex-col justify-between">
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoicepaymentMethod")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                  {data.paymentMethod}
                </span>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("ShippingCost")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                  {currency}
                  {getNumberTwo(data.shippingCost)}
                </span>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoiceDicount")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                  {currency}
                  {getNumberTwo(data.discount)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoiceTotalAmount")}
                </span>
                <span className="text-xl font-serif font-bold text-red-500 dark:text-emerald-500 block">
                  {currency}
                  {getNumberTwo(data.total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {!loading && (
        <div className="mb-4 mt-3 flex justify-between">
          <PDFDownloadLink
            document={
              <InvoiceForDownload
                t={t}
                data={data}
                currency={currency}
                getNumberTwo={getNumberTwo}
                showDateFormat={showDateFormat}
              />
            }
            fileName="Invoice"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                "Loading..."
              ) : (
                <button className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-2 rounded-md text-white bg-emerald-500 border border-transparent active:bg-emerald-600 hover:bg-emerald-600  w-auto cursor-pointer">
                  Download Invoice
                  <span className="ml-2 text-base">
                    <IoCloudDownloadOutline />
                  </span>
                </button>
              )
            }
          </PDFDownloadLink>

          <ReactToPrint
            trigger={() => (
              <button className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-2 rounded-md text-white bg-emerald-500 border border-transparent active:bg-emerald-600 hover:bg-emerald-600  w-auto">
                {t("PrintInvoice")}
                <span className="ml-2">
                  <FiPrinter />
                </span>
              </button>
            )}
            content={() => printRef.current}
            documentTitle="Invoice"
          />
        </div>
      )}
    </>
  );
};

export default OrderInvoice;
