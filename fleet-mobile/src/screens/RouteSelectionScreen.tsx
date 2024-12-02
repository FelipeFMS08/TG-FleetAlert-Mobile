import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { decodeToken } from "../api/auth/auth";
import { findByUserId } from "../api/routes/route";
import { RouteResponse, RouteTrackingResponse } from "../dto/responses/routes.response";

export default function RouteSelectionScreen({ navigation }: any) {
    const [routes, setRoutes] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchRoutesToSelected();
    }, []);

    const fetchRoutesToSelected = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const { id } = await decodeToken();
            const allRoutes: RouteTrackingResponse[] = await findByUserId(id.toString());
            const newRoutes = allRoutes
                .slice((page - 1) * 10, page * 10)
                .map((route) => ({
                    id: route.route.id || Math.random().toString(),
                    ...route,
                }));
            if (newRoutes.length === 0) {
                setHasMore(false);
            } else {
                setRoutes((prevRoutes) => [...prevRoutes, ...newRoutes]);
                setPage(page + 1);
            }
        } catch (error) {
            console.error("Erro ao carregar rotas:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "WAITING":
                return { backgroundColor: "#71717A", color: "#FAFAFA" };
            case "STARTED":
                return { backgroundColor: "#2563EB", color: "#FAFAFA" };
            case "FINISHED":
                return { backgroundColor: "#22C55E", color: "#FAFAFA" };
            default:
                return { backgroundColor: "#D1D5DB", color: "#1F2937" };
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "WAITING":
                return "AGUARDANDO INICIO DE ROTA"
            case "STARTED":
                 return "EM MONITORAMENTO"
            case "FINISHED":
                 return "ROTA FINALIZADA"
            default:
                 return "SEM INFORMAÇÕES PARA ESSA ROTA"
        }
    }

    const renderRoute = ({ item }: { item: RouteTrackingResponse }) => {
        const statusStyle = getStatusStyle(item.route.status);
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("Map", { routeData: item.route })}
            >
                <Text style={styles.title}>{item.route.name}</Text>
                <Text style={styles.subtitle}>Usuário: {item.user.name}</Text>
                <View style={[styles.statusContainer, { backgroundColor: statusStyle.backgroundColor }]}>
                    <Text style={[styles.statusText, { color: statusStyle.color }]}>
                        {getStatusText(item.route.status)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={routes}
                keyExtractor={(item: RouteTrackingResponse) =>
                    item.route.id?.toString() || "undefined-key"
                }
                renderItem={renderRoute}
                onEndReached={fetchRoutesToSelected}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading ? (
                        <ActivityIndicator size="small" color="#FAFAFA" />
                    ) : !hasMore ? (
                        <Text style={styles.endText}>Não há mais rotas.</Text>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#18181B",
    },
    card: {
        backgroundColor: "#27272A",
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FAFAFA",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#A1A1AA",
        marginBottom: 12,
    },
    statusContainer: {
        alignSelf: "flex-start",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    endText: {
        textAlign: "center",
        marginVertical: 16,
        fontSize: 14,
        color: "#888",
    },
});
