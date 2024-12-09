import React from "react";
import nodata from "../../assets/image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import ComponentLoader from "../ComponentLoader/ComponentLoader";

const DefaultTable = ({
  columns,
  data,
  actions,
  editRow,

  onFieldChange,
  onSave,
  onCancel,
  onView,
  onSort,
  sortConfig,
  isLoading
}) => {
  return (
    <>
          {isLoading && <ComponentLoader/>}
  
    <div className="overflow-x-auto hide-scrollbar">

      <table className="w-full bg-[#F9F9F9] border-separate border-spacing-0">
        <thead className="p-6 ">
          <tr className="border-b border-gray-300 whitespace-nowrap ">
            <th
              className="py-4 px-6 "
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "19.36px",
                textAlign: "center",
                color: "#1D192980"
              }}
            >
              <div className="flex items-center justify-center">S No.</div>
            </th>
          {columns.map((column, index) => (
            <th
              key={index}
              className="py-4 px-6 "
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "19.36px",
                textAlign: "center",
                color: "#1D192980",
               
              }}
            >
              <div className="rounded-lg w-[160px] h-[30px] flex flex-row justify-center items-center gap-2">
                <span className="flex items-center gap-2">
                  {typeof column === 'object' ? column.name : column}
                </span>
                {typeof column === "object" && column.sortable && column.name !== "S No." && (
                  <span 
                    className="cursor-pointer flex items-center justify-center"
                    onClick={() => onSort(column.name)}
                  >
                    {sortConfig.key === column.name && sortConfig.direction === "asc" ? (
                      <FontAwesomeIcon icon={faSortUp} className="text-blue-500 pt-3" />
                    ) : sortConfig.key === column.name && sortConfig.direction === "desc" ? (
                      <FontAwesomeIcon icon={faSortDown} className="text-blue-500 pb-3" />
                    ) : (
                      <FontAwesomeIcon icon={faSortUp} className="text-gray-400 pt-3" />
                    )}
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>

        </thead>

        <tbody className="bg-[#F9F9F9] py-4 px-6">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-4 px-4 text-center text-gray-500 capitalize"
              >
                <div className="flex flex-col w-full h-96 bg-white justify-center items-center">
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <img src={nodata} alt="No Data" className="w-40 h-40" loading="lazy" />
                    <h1 className="work-sans-style text-[#A5A3A9]">No Data Found</h1>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr className="py-4 px-6 text-center bg-[#FFFFFF]">
                <td
                    className="p-4 capitalize whitespace-nowrap"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "18px",
                      fontWeight: 500,
                      lineHeight: "21.78px",
                      letterSpacing: "0.03em",
                      textAlign: "center",
                      color: "#1D1929",
                    }}
                  >
                    {rowIndex + 1} 
                  </td>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`p-4 capitalize whitespace-nowrap`}
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "18px",
                        fontWeight: 500,
                        lineHeight: "21.78px",
                        letterSpacing: "0.03em",
                        textAlign: "center",
                        color: "#1D1929",
                      }}
                    >
                      {column === "Actions" || column === "Comments" ? (
                        editRow && editRow["id"] === row["id"] ? (
                          <div className="flex space-x-2 justify-center items-center">
                            <button
                              onClick={() => onSave(row["id"])}
                              className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => onCancel(row["id"])}
                              className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2 justify-center items-center">
                          {actions(row, rowIndex)?.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          className={action?.className}
                          onClick={() => action?.onClick(row, rowIndex)}
                        >
                                <span
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "13px",
                                    fontWeight: 400,
                                    lineHeight: "22px",
                                    letterSpacing: "-0.01em",
                                    textAlign: "center",
                                  }}
                                >
                                  {action?.text}
                                </span>{" "}
                                {action?.icon}
                              </button>
                            ))}
                          </div>
                        )
                      ) : editRow && editRow["id"] === row["id"] && column !== "Actions" ? (
                        <input
                          type="text"
                          name={column}
                          value={editRow[column] || ""}
                          onChange={(e) => onFieldChange(e, row["id"])}
                          className="border border-gray-300 rounded-md px-2 py-1"
                        />
                      ) : typeof row[column] === "object" ? (
                        <div className="flex flex-col items-center justify-between">
                     
                          {row[column].map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-row w-full gap-2 mb-2 justify-center items-center"
                            >
                              <span
                                className="capitalize"
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "18px",
                                  fontWeight: 500,
                                  lineHeight: "21.78px",
                                  letterSpacing: "0.03em",
                                  textAlign: "center",
                                  color: "#1D1929",
                                }}
                              >
                                {item.name}:
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : column === 'Action' ? (
                        <button onClick={() => onView(row.id)}>
                          {row[column]}
                        </button>
                      ) : (
                        row[column] || row[column.name]
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td colSpan={columns.length} className="bg-[#F9F9F9] h-4"></td>
                </tr>
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default DefaultTable;
