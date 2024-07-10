const createSpec = (typeChart, idData, paddingR, paddingL) => {
  const spec = {
    type: typeChart,
    data: [
      {
        id: `${idData}`,
        values: [],
      },
    ],
    outerRadius: 0.6,
    categoryField: "type",
    valueField: "value",
    legends: {
      // visible: true,
      orient: "top",
      item: {
        // visible: true,
        padding: {
          right: paddingR,
          left: paddingL,
        },
        background: {
          style: {
            fill: "transparent",
          },
        },
      },
    },
    label: {
      visible: true,
    },
    
  };

  return spec;
};

export { createSpec };