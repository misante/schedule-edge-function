"use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   CircularProgress,
//   Typography,
//   Box,
// } from "@mui/material";

// export default function DocumentsPage() {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     // Fetch documents via API
//     const fetchDocuments = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch("/api/documents", {
//           method: "GET",
//         });
//         const data = await response.json();
//         console.log(data.data);
//         if (response.ok) {
//           setDocuments(data.data);
//         } else {
//           console.error("Error fetching documents:", data.error);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDocuments();
//   }, []);

//   // Handle the redirection to create a new document
//   const handleCreateNewDocument = () => {
//     router.push("/create-document"); // Assumes your form is at '/create-document'
//   };

//   return (
//     <Box sx={{ padding: 3 }}>
//       <Typography variant="h4" gutterBottom sx={{ fontSize: 36, font: "bold" }}>
//         Document Management
//       </Typography>

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleCreateNewDocument}
//         sx={{ marginBottom: 2 }}
//       >
//         Create New Document
//       </Button>

//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <TableContainer component={Paper}>
//           <Table sx={{ minWidth: 650 }} aria-label="documents table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Expiration Date</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {documents.map((document) => (
//                 <TableRow key={document.id}>
//                   <TableCell>{document.id}</TableCell>
//                   <TableCell>{document.name}</TableCell>
//                   <TableCell>
//                     {new Date(document.expiration_date).toLocaleDateString()}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// }
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Box,
  Grid,
} from "@mui/material";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/documents");
        const data = await response.json();
        if (response.ok) {
          setDocuments(data.data);
        } else {
          console.error("Error fetching documents:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleCreateNewDocument = () => {
    router.push("/create-document");
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Document Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateNewDocument}
        sx={{ marginBottom: 2 }}
      >
        Create New Document
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="documents table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                  Expiration Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "1rem" } }}>
                    {document.id}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "1rem" } }}>
                    {document.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "1rem" } }}>
                    {new Date(document.expiration_date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}