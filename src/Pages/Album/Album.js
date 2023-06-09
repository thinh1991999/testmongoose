import React, { memo, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "../../store";
import httpService from "../../Services/http.service";
import { AlbumLeft, AlbumRight, Artists, Loading } from "../../components";
import styles from "./Album.module.scss";

function Album() {
  const dispatch = useDispatch();

  const { id } = useParams();

  const playing = useSelector((state) => state.song.playing);

  const [loading, setLoading] = useState(true);
  const [albumData, setAlbumData] = useState(null);

  useEffect(() => {
    const fetchAlbum = () => {
      setLoading(true);
      httpService.getAlbum(id).then((res) => {
        const { data } = res.data;
        dispatch(actions.setAlbum(data));
        setAlbumData(data);
        setLoading(false);
      });
    };
    fetchAlbum();
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(actions.setBGHeader(true));
    dispatch(actions.setCurrentNav(""));
  }, [dispatch]);

  useEffect(() => {
    if (!playing) {
      document.title = albumData?.title || "Album";
    }
  }, [albumData, playing]);

  if (loading) {
    return <Loading size={50} />;
  }

  const {
    title,
    like,
    thumbnailM,
    contentLastUpdate,
    sortDescription,
    song,
    artists,
    encodeId: albumId,
  } = albumData;
  return (
    <div className={styles.album}>
      <div className={styles.albumContainer}>
        <Row className={styles.albumWrap}>
          <Col xl={4} lg={12}>
            <AlbumLeft
              data={{
                title,
                like,
                image: thumbnailM,
                artists,
                update: contentLastUpdate,
                albumId,
                song,
              }}
            />
          </Col>
          <Col xl={8} lg={12}>
            <AlbumRight title={sortDescription} song={song} />
          </Col>
        </Row>
        {artists ? (
          <Artists
            data={{
              title: "Nghệ sĩ tham gia",
              items: [...artists],
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default memo(Album);
