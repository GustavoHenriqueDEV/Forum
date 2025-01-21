import React from "react";
import {
  Box,
  List,
  ListItem,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import { useMostViwedPosts } from "../Sidebar/hooks/useMostViewedPosts";

export default function RightSideBar({ setFilter, onPostClick }) {
  const { posts } = useMostViwedPosts();

  return (
    <Box
      sx={{
        position: "fixed",
        right: 0,
        top: "70px",
        width: "240px",
        height: "calc(100vh - 64px)",
        borderLeft: "1px solid #3e4142",
        backgroundColor: "#1e252b",
        color: "#d7dadc",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "#d7dadc" }}>
        Posts Populares
      </Typography>
      <Divider sx={{ mb: 2, borderColor: "#3e4142" }} />
      <List>
        {posts.map((post) => (
          <ListItem
            key={post.idpost}
            sx={{
              padding: 0,
              mb: 2,
            }}
          >
            <Card
              sx={{
                width: "100%",
                backgroundColor: "#2a2f38",
                borderRadius: 2,
                boxShadow: 2,
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 4,
                },
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
            >
              <CardActionArea onClick={() => onPostClick(post.idpost)}>
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    src={`data:image/png;base64,${post.imageBase64}`}
                    alt="Post Image"
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "8px",
                    }}
                  />
                  <Box sx={{ overflow: "hidden" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {post.titulo}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#d7dadc",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {post.conteudo.substring(0, 50)}...
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
