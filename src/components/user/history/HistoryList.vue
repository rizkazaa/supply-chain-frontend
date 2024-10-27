<template>
  <div class="history-list">
    <h2>Riwayat Peminjaman</h2>

    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID</th>

            <th>Nama Barang</th>

            <th>Jumlah Pinjam</th>

            <th>Tanggal Pinjam</th>

            <th>Tanggal Kembali</th>

            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="history in histories" :key="history.id">
            <td>{{ history.id }}</td>

            <td>{{ history.namaBarang }}</td>

            <td>{{ history.jumlahPinjam }}</td>

            <td>{{ history.tanggalPinjam }}</td>

            <td>{{ history.tanggalKembali }}</td>

            <td :class="['status', history.status.toLowerCase()]">
              {{ history.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "HistoryList",

  data() {
    return {
      histories: [
        {
          id: 1,

          namaBarang: "Acer Nitro 15 AN515-58",

          jumlahPinjam: 1,

          tanggalPinjam: "2023-05-01",

          tanggalKembali: "2023-05-10",

          status: "selesai",
        },

        {
          id: 2,

          namaBarang: "Lenovo LOQ 15 15IRH8",

          jumlahPinjam: 2,

          tanggalPinjam: "2023-06-15",

          tanggalKembali: "2023-06-20",

          status: "diproses",
        },
      ],
    };
  },
};
</script>

<style scoped>
.history-list {
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

h2 {
  color: #35c88d;
  font-size: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #35c88d;
  color: white;
  text-transform: uppercase;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
}

.status {
  text-transform: capitalize;
  font-weight: bold;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  text-align: center;
}

.status.diproses {
  color: #fed86e;
}

.status.selesai {
  color: #35c88d;
}
</style>
