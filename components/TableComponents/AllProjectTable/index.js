import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";
import React, { useState, useMemo, useRef, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Feather, Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo-linear-gradient";

import styles from "./styles";
import SkeletonLoader from "@/components/SkeletonDesign/PackageTableRow";
import { convertToCr, width } from "@/services/helper";
import { colors, radius, spacing } from "@/constants/theme";

const { width: screenWidth } = Dimensions.get("window");

const FILTER_KEYS = {
  name: "name",
  procurement: "procurement",
  contractMin: "contractMin",
  contractMax: "contractMax",
  physicalMin: "physicalMin",
  physicalMax: "physicalMax",
  financialMin: "financialMin",
  financialMax: "financialMax",
  updatedFrom: "updatedFrom",
  updatedTo: "updatedTo",
};

const normaliseText = (value) => String(value || "").trim().toLowerCase();

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : null;
};

const toDateStamp = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate = Date.parse(value);
  return Number.isNaN(parsedDate) ? null : parsedDate;
};

const getProcurementLabel = (item) =>
  item?.type_of_procurement || item?.procurement_type || "Unknown";

const getStatusLabel = (item) => item?.status || item?.project_status || "";

const ShimmerBar = ({ progress, color }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      const animation = Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      );

      animation.start();

      return () => {
        animation.stop();
        shimmerAnim.setValue(0);
      };
    }, [shimmerAnim])
  );

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, screenWidth],
  });

  return (
    <View style={styles.progressTrack}>
      <Progress.Bar
        progress={progress}
        width={null}
        height={10}
        borderRadius={8}
        color={color}
        unfilledColor="#E6EAF0"
        borderWidth={0}
        animated
      />

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.6)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.progressShimmer}
        />
      </Animated.View>
    </View>
  );
};

const ProgressWithLabel = ({ label, progress, color }) => {
  const safeProgress = Number.isFinite(progress) ? progress : 0;

  return (
    <View style={styles.progressBlock}>
      <View style={styles.progressHeaderRow}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressValue}>{Math.round(safeProgress * 100)}%</Text>
      </View>
      <ShimmerBar progress={safeProgress} color={color} />
    </View>
  );
};

const ActionButton = ({ label, color, icon, onPress, disabled }) => (
  <TouchableOpacity
    style={[
      styles.actionButton,
      { backgroundColor: color },
      disabled && styles.actionButtonDisabled,
    ]}
    onPress={disabled ? null : onPress}
    activeOpacity={0.7}
    disabled={disabled}
  >
    <FontAwesome5 name={icon} size={13} color="#fff" style={styles.actionIcon} />
    <Text style={styles.actionButtonText}>{label}</Text>
  </TouchableOpacity>
);

const FilterField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
}) => (
  <View style={styles.filterField}>
    <Text style={styles.filterFieldLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      placeholderTextColor="#94a3b8"
      style={styles.filterInput}
    />
  </View>
);

const AllprojectTable = ({
  refresh,
  handleRefresh,
  projectData,
  loading,
  onTableScroll,
}) => {
  const navigation = useNavigation();
  const [expandedRows, setExpandedRows] = useState({});
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    [FILTER_KEYS.name]: "",
    [FILTER_KEYS.procurement]: "",
    [FILTER_KEYS.contractMin]: "",
    [FILTER_KEYS.contractMax]: "",
    [FILTER_KEYS.physicalMin]: "",
    [FILTER_KEYS.physicalMax]: "",
    [FILTER_KEYS.financialMin]: "",
    [FILTER_KEYS.financialMax]: "",
    [FILTER_KEYS.updatedFrom]: "",
    [FILTER_KEYS.updatedTo]: "",
  });

  const procurementOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        (projectData || [])
          .map((item) => getProcurementLabel(item))
          .filter(Boolean)
      )
    );

    return values;
  }, [projectData]);

  const activeFilterEntries = useMemo(
    () =>
      Object.entries(filters).filter(([, value]) => String(value || "").trim().length > 0),
    [filters]
  );

  const activeFilterCount = activeFilterEntries.length + (searchText.trim() ? 1 : 0);

  const setFilterValue = useCallback((key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }, []);

  const clearFilter = useCallback((key) => {
    setFilters((current) => ({
      ...current,
      [key]: "",
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchText("");
    setFilters({
      [FILTER_KEYS.name]: "",
      [FILTER_KEYS.procurement]: "",
      [FILTER_KEYS.contractMin]: "",
      [FILTER_KEYS.contractMax]: "",
      [FILTER_KEYS.physicalMin]: "",
      [FILTER_KEYS.physicalMax]: "",
      [FILTER_KEYS.financialMin]: "",
      [FILTER_KEYS.financialMax]: "",
      [FILTER_KEYS.updatedFrom]: "",
      [FILTER_KEYS.updatedTo]: "",
    });
  }, []);

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredData = useMemo(() => {
    const searchValue = normaliseText(searchText);
    const nameFilter = normaliseText(filters[FILTER_KEYS.name]);
    const procurementFilter = normaliseText(filters[FILTER_KEYS.procurement]);
    const contractMin = toNumber(filters[FILTER_KEYS.contractMin]);
    const contractMax = toNumber(filters[FILTER_KEYS.contractMax]);
    const physicalMin = toNumber(filters[FILTER_KEYS.physicalMin]);
    const physicalMax = toNumber(filters[FILTER_KEYS.physicalMax]);
    const financialMin = toNumber(filters[FILTER_KEYS.financialMin]);
    const financialMax = toNumber(filters[FILTER_KEYS.financialMax]);
    const updatedFrom = toDateStamp(filters[FILTER_KEYS.updatedFrom]);
    const updatedTo = toDateStamp(filters[FILTER_KEYS.updatedTo]);

    // Optimization: Consider using useMemo for server-normalized filter payloads too if this table grows significantly.
    return (projectData || []).filter((item) => {
      const itemName = normaliseText(item?.name);
      const itemProcurement = normaliseText(getProcurementLabel(item));
      const itemContractValue = toNumber(item?.contract_value) ?? 0;
      const itemPhysicalProgress = toNumber(item?.physical_progress) ?? 0;
      const itemFinancialProgress = toNumber(item?.financial_progress) ?? 0;
      const itemDateStamp =
        toDateStamp(item?.updated_at) ||
        toDateStamp(item?.created_at) ||
        toDateStamp(item?.approval_date);

      if (searchValue && !itemName.includes(searchValue)) {
        return false;
      }

      if (nameFilter && !itemName.includes(nameFilter)) {
        return false;
      }

      if (procurementFilter && itemProcurement !== procurementFilter) {
        return false;
      }

      if (contractMin !== null && itemContractValue < contractMin) {
        return false;
      }

      if (contractMax !== null && itemContractValue > contractMax) {
        return false;
      }

      if (physicalMin !== null && itemPhysicalProgress < physicalMin) {
        return false;
      }

      if (physicalMax !== null && itemPhysicalProgress > physicalMax) {
        return false;
      }

      if (financialMin !== null && itemFinancialProgress < financialMin) {
        return false;
      }

      if (financialMax !== null && itemFinancialProgress > financialMax) {
        return false;
      }

      if (updatedFrom !== null && itemDateStamp !== null && itemDateStamp < updatedFrom) {
        return false;
      }

      if (updatedTo !== null && itemDateStamp !== null && itemDateStamp > updatedTo) {
        return false;
      }

      return true;
    });
  }, [filters, projectData, searchText]);

  const renderSkeleton = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <View key={i} style={styles.skeletonRow}>
          <View style={styles.skeletonTextWrap}>
            <SkeletonLoader width={width * 0.5} height={15} style={styles.skeletonBlock} />
            <SkeletonLoader width={width * 0.4} height={15} style={styles.skeletonBlock} />
            <SkeletonLoader width={50} height={15} />
          </View>

          <SkeletonLoader width={100} height={30} />
        </View>
      ))}
    </>
  );

  const renderFilterChip = ([key, value]) => (
    <TouchableOpacity
      key={key}
      style={styles.activeFilterChip}
      onPress={() => clearFilter(key)}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Clear filter ${key}`}
    >
      <Text style={styles.activeFilterText}>
        {key.replace(/([A-Z])/g, " $1")}: {String(value)}
      </Text>
      <Ionicons name="close-circle" size={14} color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.table}>
      <View style={styles.toolbar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#64748b" />
          <TextInput
            placeholder="Search sub-projects"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            placeholderTextColor="#94a3b8"
          />
          {searchText.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchText("")} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.filterToggleButton, activeFilterCount > 0 && styles.filterToggleActive]}
          onPress={() => setShowFilters((current) => !current)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Toggle table filters"
        >
          <Feather
            name="sliders"
            size={16}
            color={activeFilterCount > 0 ? colors.primary : colors.textMuted}
          />
          <Text
            style={[
              styles.filterToggleText,
              activeFilterCount > 0 && styles.filterToggleTextActive,
            ]}
          >
            Filters
          </Text>
          {activeFilterCount > 0 ? (
            <View style={styles.filterCountBadge}>
              <Text style={styles.filterCountText}>{activeFilterCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {showFilters ? (
        <View style={styles.filterPanel}>
          <View style={styles.filterHeaderRow}>
            <Text style={styles.filterPanelTitle}>Filter sub-projects</Text>
            <TouchableOpacity onPress={clearAllFilters} activeOpacity={0.75}>
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterGrid}>
            <FilterField
              label="Project name"
              value={filters[FILTER_KEYS.name]}
              onChangeText={(value) => setFilterValue(FILTER_KEYS.name, value)}
              placeholder="Contains text"
            />
            <FilterField
              label="Updated from"
              value={filters[FILTER_KEYS.updatedFrom]}
              onChangeText={(value) => setFilterValue(FILTER_KEYS.updatedFrom, value)}
              placeholder="YYYY-MM-DD"
            />
            <FilterField
              label="Updated to"
              value={filters[FILTER_KEYS.updatedTo]}
              onChangeText={(value) => setFilterValue(FILTER_KEYS.updatedTo, value)}
              placeholder="YYYY-MM-DD"
            />
            <FilterField
              label="Contract min"
              value={filters[FILTER_KEYS.contractMin]}
              onChangeText={(value) => setFilterValue(FILTER_KEYS.contractMin, value)}
              placeholder="Minimum value"
              keyboardType="numeric"
            />
            <FilterField
              label="Contract max"
              value={filters[FILTER_KEYS.contractMax]}
              onChangeText={(value) => setFilterValue(FILTER_KEYS.contractMax, value)}
              placeholder="Maximum value"
              keyboardType="numeric"
            />
            <FilterField
              label="Physical min %"
              value={filters[FILTER_KEYS.physicalMin]}
              onChangeText={(value) => setFilterValue(FILTER_KEYS.physicalMin, value)}
              placeholder="0"
              keyboardType="numeric"
            />
            <FilterField
              label="Physical max %"
              value={filters[FILTER_KEYS.physicalMax]}
              onChangeText={(value) => setFilterValue(FILTER_KEYS.physicalMax, value)}
              placeholder="100"
              keyboardType="numeric"
            />
            <FilterField
              label="Financial min %"
              value={filters[FILTER_KEYS.financialMin]}
              onChangeText={(value) => setFilterValue(FILTER_KEYS.financialMin, value)}
              placeholder="0"
              keyboardType="numeric"
            />
            <FilterField
              label="Financial max %"
              value={filters[FILTER_KEYS.financialMax]}
              onChangeText={(value) => setFilterValue(FILTER_KEYS.financialMax, value)}
              placeholder="100"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.procurementSection}>
            <Text style={styles.filterFieldLabel}>Procurement type</Text>
            <View style={styles.procurementChipRow}>
              {procurementOptions.map((option) => {
                const isActive =
                  normaliseText(filters[FILTER_KEYS.procurement]) === normaliseText(option);

                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.procurementChip,
                      isActive && styles.procurementChipActive,
                    ]}
                    onPress={() =>
                      setFilterValue(
                        FILTER_KEYS.procurement,
                        isActive ? "" : option
                      )
                    }
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.procurementChipText,
                        isActive && styles.procurementChipTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      ) : null}

      {activeFilterCount > 0 ? (
        <View style={styles.activeFiltersWrap}>
          {searchText.trim() ? (
            <TouchableOpacity
              style={styles.activeFilterChip}
              onPress={() => setSearchText("")}
              activeOpacity={0.75}
            >
              <Text style={styles.activeFilterText}>Search: {searchText}</Text>
              <Ionicons name="close-circle" size={14} color={colors.primary} />
            </TouchableOpacity>
          ) : null}
          {activeFilterEntries.map(renderFilterChip)}
        </View>
      ) : null}

      {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={filteredData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => String(item?.id || index)}
          refreshControl={<RefreshControl refreshing={refresh} onRefresh={handleRefresh} />}
          stickyHeaderIndices={[0]}
          onScroll={onTableScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.tableHeaderRow}>
              <Text style={styles.headerCell}>Sub-Project Details</Text>
              <Text style={styles.headerCellRight}>Actions</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const expanded = expandedRows[item?.id] || false;
            const procurementLabel = getProcurementLabel(item);
            const statusLabel = getStatusLabel(item);

            return (
              <View
                style={[
                  styles.projectCard,
                  index === 0 && styles.projectCardFirst,
                ]}
              >
                <View style={styles.projectDetailsColumn}>
                  <View style={styles.projectTitleRow}>
                    <View style={styles.projectTitleWrap}>
                      <View style={styles.projectIconBadge}>
                        <FontAwesome name="folder-open" size={12} color={colors.primary} />
                      </View>
                      <Text
                        style={styles.projectName}
                        numberOfLines={expanded ? undefined : 2}
                      >
                        {item?.name}
                      </Text>
                    </View>

                    <View style={styles.projectMetaChips}>
                      <View style={styles.projectMetaChip}>
                        <Text style={styles.projectMetaChipText}>{procurementLabel}</Text>
                      </View>
                      {statusLabel ? (
                        <View style={[styles.projectMetaChip, styles.projectStatusChip]}>
                          <Text style={styles.projectStatusChipText}>{statusLabel}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  {item?.name?.length > 60 ? (
                    <TouchableOpacity
                      style={styles.expandToggle}
                      onPress={() => toggleExpand(item?.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.expandToggleText}>
                        {expanded ? "Hide full name ▲" : "View full name ▼"}
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  <View style={styles.metricInlineRow}>
                    <Text style={styles.metricInlineLabel}>Contract Value:</Text>
                    <Text style={styles.contractValueText}>
                      {convertToCr(item?.contract_value)}
                    </Text>
                  </View>

                  <ProgressWithLabel
                    label="Physical Progress"
                    progress={(item?.physical_progress || 0) / 100}
                    color="#28a745"
                  />
                  <ProgressWithLabel
                    label="Financial Progress"
                    progress={(item?.financial_progress || 0) / 100}
                    color="#007BFF"
                  />
                </View>

                <View style={styles.actionColumn}>
                  <ActionButton
                    label="Financial"
                    color="#28a745"
                    icon="money-bill-wave"
                    onPress={() => navigation.navigate("FinancialScreen", { data: item })}
                  />
                  <ActionButton
                    label="Safeguard"
                    color="#f59e0b"
                    icon="vial"
                    onPress={() => navigation.navigate("SafeguardScreen", { data: item })}
                  />
                  {item?.type_of_procurement === "EPC" ? (
                    <ActionButton
                      label="EPC"
                      color="#007BFF"
                      icon="building"
                      onPress={() => navigation.navigate("ECPScreen", { data: item })}
                    />
                  ) : (
                    <ActionButton
                      label="BOQ"
                      color="#17A2B8"
                      icon="list-alt"
                      onPress={() => navigation.navigate("BOQScreen", { data: item })}
                    />
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>
                  {activeFilterCount > 0
                    ? "No sub-project matches these filters"
                    : "No packages available right now"}
                </Text>
                <Text style={styles.emptyStateText}>
                  {activeFilterCount > 0
                    ? "Try clearing one or two filters to widen the results."
                    : "New sub-project packages will appear here once they are available."}
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={<View style={styles.footerSpace} />}
        />
      )}
    </View>
  );
};

export default AllprojectTable;
