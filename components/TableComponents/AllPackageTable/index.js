import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useMemo, useState } from "react";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";
import SkeletonLoader from "@/components/SkeletonDesign/PackageTableRow";
import { convertToCr, width } from "@/services/helper";

const contractFilters = [
  { key: "all", label: "All" },
  { key: "withContracts", label: "With Contracts" },
  { key: "withoutContracts", label: "Without Contracts" },
];

const AllPackageTable = ({
  refresh,
  handleRefresh,
  projectData,
  loading,
  errorMessage,
  cacheMessage,
  isStaleData,
  isOnline,
  onRetry,
}) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedContractFilter, setSelectedContractFilter] = useState("all");

  const departments = useMemo(() => {
    const items = Array.from(
      new Set(
        (projectData || [])
          .map((item) => item?.department)
          .filter(Boolean)
      )
    );

    return ["all", ...items];
  }, [projectData]);

  const filteredData = useMemo(() => {
    let nextData = Array.isArray(projectData) ? [...projectData] : [];

    if (selectedDepartment !== "all") {
      nextData = nextData.filter(
        (item) => item?.department === selectedDepartment
      );
    }

    if (selectedContractFilter === "withContracts") {
      nextData = nextData.filter((item) => (item?.contracts?.length || 0) > 0);
    }

    if (selectedContractFilter === "withoutContracts") {
      nextData = nextData.filter((item) => (item?.contracts?.length || 0) === 0);
    }

    if (!searchText.trim()) {
      return nextData;
    }

    const lower = searchText.toLowerCase();
    return nextData.filter(
      (item) =>
        item?.id?.toString().toLowerCase().includes(lower) ||
        item?.package_name?.toLowerCase().includes(lower) ||
        item?.department?.toLowerCase().includes(lower) ||
        item?.category?.toLowerCase().includes(lower) ||
        item?.sub_category?.toLowerCase().includes(lower)
    );
  }, [projectData, searchText, selectedDepartment, selectedContractFilter]);

  const summary = useMemo(() => {
    const totalBudget = filteredData.reduce(
      (sum, item) => sum + Number(item?.estimated_budget_incl_gst || 0),
      0
    );
    const withContracts = filteredData.filter(
      (item) => (item?.contracts?.length || 0) > 0
    ).length;

    return {
      total: filteredData.length,
      withContracts,
      withoutContracts: Math.max(filteredData.length - withContracts, 0),
      budget: convertToCr(totalBudget),
    };
  }, [filteredData]);

  const renderSkeleton = () => (
    <View style={styles.skeletonWrap}>
      {[...Array(5)].map((_, i) => (
        <View key={i} style={styles.skeletonCard}>
          <SkeletonLoader width={90} height={18} />
          <View style={styles.skeletonBody}>
            <SkeletonLoader
              width={width * 0.5}
              height={15}
              style={styles.skeletonLine}
            />
            <SkeletonLoader
              width={width * 0.4}
              height={15}
              style={styles.skeletonLine}
            />
            <SkeletonLoader width={90} height={15} />
          </View>
          <SkeletonLoader width={120} height={38} />
        </View>
      ))}
    </View>
  );

  const renderEmptyState = () => {
    if (loading) {
      return null;
    }

    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons
          name={errorMessage ? "cloud-alert-outline" : "package-variant-closed"}
          size={34}
          color={errorMessage ? "#dc2626" : "#64748b"}
        />
        <Text style={styles.emptyTitle}>
          {errorMessage
            ? "Package data needs attention"
            : searchText ||
              selectedDepartment !== "all" ||
              selectedContractFilter !== "all"
            ? "No packages match these filters"
            : "No packages available"}
        </Text>
        <Text style={styles.emptyBody}>
          {errorMessage ||
            "Try a different search term or adjust the department and contract filters."}
        </Text>
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Feather name="refresh-cw" size={16} color="#fff" />
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  };

  const renderBanner = () => {
    if (!errorMessage && !cacheMessage) {
      return null;
    }

    return (
      <View
        style={[
          styles.banner,
          errorMessage ? styles.bannerWarning : styles.bannerInfo,
        ]}
      >
        <View style={styles.bannerIconWrap}>
          <Ionicons
            name={errorMessage ? "alert-circle-outline" : "time-outline"}
            size={18}
            color={errorMessage ? "#b45309" : "#0b57a4"}
          />
        </View>
        <View style={styles.bannerCopy}>
          {errorMessage ? (
            <Text style={styles.bannerTitle}>{errorMessage}</Text>
          ) : null}
          {cacheMessage ? (
            <Text style={styles.bannerText}>
              {cacheMessage}
              {isStaleData ? " · Saved data shown" : ""}
            </Text>
          ) : null}
          {!isOnline ? (
            <Text style={styles.bannerText}>You are offline right now.</Text>
          ) : null}
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerWrap}>
      <View style={styles.searchCard}>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#64748b" />
          <TextInput
            placeholder="Search package, department, category..."
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            placeholderTextColor="#94a3b8"
          />
          {loading ? (
            <ActivityIndicator size="small" color="#0b57a4" />
          ) : null}
          {searchText.length > 0 ? (
            <Pressable onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryChip}>
            <Text style={styles.summaryValue}>{summary.total}</Text>
            <Text style={styles.summaryLabel}>Visible</Text>
          </View>
          <View style={styles.summaryChip}>
            <Text style={styles.summaryValue}>{summary.withContracts}</Text>
            <Text style={styles.summaryLabel}>With Contracts</Text>
          </View>
          <View style={styles.summaryChip}>
            <Text style={styles.summaryValue}>{summary.budget}</Text>
            <Text style={styles.summaryLabel}>Budget</Text>
          </View>
        </View>
      </View>

      {renderBanner()}

      <View style={styles.filterBlock}>
        <Text style={styles.filterHeading}>Department</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {departments.map((department) => {
            const active = selectedDepartment === department;
            const label = department === "all" ? "All Departments" : department;
            return (
              <Pressable
                key={department}
                onPress={() => setSelectedDepartment(department)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.filterBlock}>
        <Text style={styles.filterHeading}>Contracts</Text>
        <View style={styles.contractRow}>
          {contractFilters.map((filter) => {
            const active = selectedContractFilter === filter.key;
            return (
              <Pressable
                key={filter.key}
                onPress={() => setSelectedContractFilter(filter.key)}
                style={[styles.contractChip, active && styles.contractChipActive]}
              >
                <Text
                  style={[
                    styles.contractChipText,
                    active && styles.contractChipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.table}>
      <FlatList
        data={loading ? [] : filteredData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${item?.id || "pkg"}-${index}`}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={loading ? renderSkeleton() : renderEmptyState()}
        renderItem={({ item, index }) => {
          const contractCount = item?.contracts?.length || 0;
          const hasContracts = contractCount > 0;

          return (
            <View style={styles.packageCard}>
              <View style={styles.cardHeader}>
                <View style={styles.serialBadge}>
                  <Text style={styles.serialBadgeText}>#{index + 1}</Text>
                </View>
                <View style={styles.packageIdBadge}>
                  <Text style={styles.packageIdBadgeText}>
                    Package ID {item?.id}
                  </Text>
                </View>
              </View>

              <Text style={styles.packageName}>{item?.package_name}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Text style={styles.metaLabel}>Department</Text>
                  <Text style={styles.metaValue}>{item?.department || "-"}</Text>
                </View>
                <View style={styles.metaChip}>
                  <Text style={styles.metaLabel}>Category</Text>
                  <Text style={styles.metaValue}>
                    {item?.category || "-"}
                    {item?.sub_category ? ` (${item?.sub_category})` : ""}
                  </Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statTile}>
                  <Text style={styles.statLabel}>Sanction Budget</Text>
                  <Text style={styles.statValue}>
                    {convertToCr(item?.estimated_budget_incl_gst)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.contractPill,
                    hasContracts
                      ? styles.contractPillActive
                      : styles.contractPillMuted,
                  ]}
                >
                  <Text
                    style={[
                      styles.contractPillText,
                      hasContracts
                        ? styles.contractPillTextActive
                        : styles.contractPillTextMuted,
                    ]}
                  >
                    {hasContracts ? `${contractCount} Contracts` : "No Contracts"}
                  </Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <Pressable
                  style={styles.primaryButton}
                  onPress={() =>
                    navigation.navigate("PackageInfoScreen", { data: item })
                  }
                >
                  <Text style={styles.primaryButtonText}>View Details</Text>
                  <Feather name="arrow-right-circle" size={16} color="#fff" />
                </Pressable>
              </View>
            </View>
          );
        }}
        ListFooterComponent={<View style={styles.footerSpace} />}
        initialNumToRender={10}
        maxToRenderPerBatch={8}
        windowSize={6}
        removeClippedSubviews
      />
    </View>
  );
};

export default AllPackageTable;
